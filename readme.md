# Puppet My HTML

## About

Puppet my HTML is an api that converts the given HTML (in `UT-8` format) to a pdf using a headless browser. It returns the response in base64.

## How it works

1. Upload a json object including your **html** as a _ut-8_ string and a **fileName** to the [api](https://puppet-my-html.herokuapp.com/create-pdf)
2. You object body should look like this `{html: <div>HTML Template</div>, fileName: 'document.pdf'}`
3. The response you'll be receiving is a _base64_ string
   1. How to convert this:
      ```
       const buff = new Buffer.from(API_RESPONSE,'base64')
       fs.writeFileSync(FILE_PATH_GOES_HERE, buff)
      ```

## Author | [Bobby Carelse](https://bobbycarelse.co.za)
