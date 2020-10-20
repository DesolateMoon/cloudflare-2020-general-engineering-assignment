# 👷 `my-worker`

Based off of 'HelloWorld' template to kick start a Cloudflare worker project.

[`index.js`](https://github.com/cloudflare/worker-template/blob/master/index.js) is the content of the Workers script.

#### Wrangler

To preview the project using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler preview --watch
```

This command will build your project, upload it to a unique URL, and open a tab in your browser to view it. This allows you to quickly test your project running on the actual Workers runtime, and optionally, even share it with others too.

The --watch flag tells Wrangler to watch your Workers project directory for changes, and will automatically update the preview tab live with the latest URL.

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).
