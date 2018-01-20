## Environment Variables

The following variables need to be set in order for
* PORT - defaults to 8080 if unset
* PAIR_MAP - the location of a pair mapping file(encrypted)
* ORG - the org we want to fetch the details from. Defaults to STEP-tw
* GITHUB_TOKEN - the github token you want to use to authenticate
* SERVE_DATA_LOCAL - a flag to tell the serve to use data locally, which it will then attempt to serve from public/data
* SECRET - the secret key used to encrypt the file pointed to by PAIR_MAP
* INTERVAL - the number of seconds between being able to trigger a github fetch. At least INTERVAL seconds need to have passed between two github fetches for a trigger to work again
