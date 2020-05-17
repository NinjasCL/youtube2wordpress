// Ninjas.cl May 2020 - Camilo Castro <camilo@ninjas.cl>
// License: MIT
// Using the youtube scrapper with a youtube url
// will fetch the info
// download the thumbnail
// and upload it to wordpress
const youtube = require("scrape-youtube").default;
const wget = require("wget-improved");
const fs = require("fs");
const config = require("./config");

// Ensure to install the plugin and enable basic auth in wordpress .htaccess
// https://github.com/WP-API/Basic-Auth/issues/35#issuecomment-470532805
const WPAPI = require("wpapi");
const wp = new WPAPI({
  endpoint: config.endpoint,
  username: config.user,
  password: config.password,
});

const wait = (ms = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const fetchInfo = async (href) => {
  await wait();
  console.log("Downloading info for", href);
  return youtube.search(href, { type: "video" }).then((results) => results[0]);
};

const fetchArgs = () => {
  // There can by any search term for the search engine
  // spaces should be changed to + signs.
  // the best result can be the complete url but sometimes
  // is better to pass search terms
  // only the first result will be retrieved
  const urls = process.argv[2];
  console.log("Processing", urls);
  return urls.split(" ");
};

const fetchVideos = async () => {
  const urls = fetchArgs();

  if (urls.length < 1) {
    return Promise.reject(new Error("No videos found in arguments"));
  }

  const videos = [];
  for (const url of urls) {
    const video = await fetchInfo(url);
    videos.push(video);
  }

  return videos;
};

const downloadThumb = async (href, name) => {
  return new Promise((resolve, reject) => {
    const file = `./thumbs/${name}.jpg`;
    if (fs.existsSync(file)) {
      console.log(file, "exists");
      return resolve(file);
    }

    const download = wget.download(href, file);
    download.on("error", (error) => {
      return reject(error);
    });

    download.on("start", (size) => {
      console.log("Downloading", href, "to", name);
    });

    download.on("end", (out) => {
      return resolve(file);
    });
  });
};

const uploadVideo = async (video) => {
  if (!video) {
    return Promise.resolve();
  }
  await wait();
  console.log("Uploading", `(${video.id}) - "${video.title}"`);
  return wp
    .media()
    .file(`./thumbs/${video.id}.jpg`, `thumb-${video.id}.jpg`)
    .create({
      title: `thumb-${video.id}`,
      alt_text: video.title,
      description: video.link,
    })
    .then((image) => {
      // uploaded the image now we can create the post
      // Configure here to change the info before creation
      // See https://github.com/WP-API/node-wpapi
      return wp.posts().create({
        title: video.title,
        content: video.link,
        featured_media: image.id,
        status: config.status,
      });
    })
    .then(() => {
      console.log("Uploaded", video.id);
    });
};

const downloadImages = async (videos) => {
  for (let video of videos) {
    if (video) {
      await wait(10);
      await downloadThumb(video.thumbnail, video.id);
    }
  }
};

const uploadVideos = async (videos) => {
  let index = 1;
  for (const video of videos) {
    console.log(`Processing ${index} of ${videos.length}`);
    try {
      await wait();
      await uploadVideo(video);
    } catch (error) {
      console.log(error, "Try again");
      await wait();
      await uploadVideos(video);
    }
    index++;
  }
};

const main = async () => {
  const videos = await fetchVideos();
  await downloadImages(videos);
  await uploadVideos(videos);
  console.log("Done\n");
};

main().catch((error) => {
  console.error(error);
});
