# Youtube 2 Wordpress Uploader

This is a simple script that will download a _Youtube_ video thumbnail
and upload it to a _Wordpress_ website including the _Youtube Url_. (Using _Wordpress JSON API_).

## Configure

The file `config.json` contains the configuration needed to connect with a _Wordpress Rest JSON API_.
Ensure that your _Wordpress_ is properly configured (Check https://github.com/WP-API/Basic-Auth/issues/35#issuecomment-470532805).

## Usage

You can use any search term (separated by spaces). The first
result will be the video uploaded. The best result is achieved
by using the full url of the video (althought sometimes this can bring the wrong video).

Use `+` signs to separate words with spaces. 

The same as _Youtube Search_ bar, try your query there first. The first result will be used.

```sh
node index.js "youtube-url1 youtube-url2 youtube-url-n"
```

## Windows

A bundled _Windows_ command prompt and _node_ executable was included.
Just exec `yt2wp.cmd`.

![screenshot.png](Windows)

https://www.virustotal.com/gui/file/3ce71e6ba784ab48e19fe2fa3dc10216dcc4379ef114dd6c35cd24fb1432e53a/detection

## License

MIT

Made with <i class="fa fa-heart">&#9829;</i> by <a href="http://ninjas.cl" target="_blank">Ninjas.cl</a>.