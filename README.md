# EDC Data Dashboard

**Please note: This repository does not contain production-grade code and is only intended for demonstration purposes.**

EDC Data Dashboard is a dev frontend application for [EDC Management API](https://github.com/eclipse-edc/Connector).

## Docker image

Pre-built docker images can be found in the following Repository: [DataDashboard Image](https://hub.docker.com/repository/docker/johann1999/data-dashboard/general)

Provide environment variables in the docker run command in order to modify the Data Management Url or the Data Catalog Url.

```
docker run --rm -p 3000:80 -e DATA_MANAGEMENT_URL="http://localhost:8182/api/v1/data" -e CATALOG_URL="http://localhost:8181/api/federatedcatalog"  johann1999/data-dashboard:linux-env
```

1. [optional] copy the current version of EDC's `management-api.yaml` file to `openapi/`. There is one checked in, so this is not required.
2. in a shell execute
   ```shell
   docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate -i /local/openapi/management-api.yaml -g typescript-angular -o /local/src/modules/edc-dmgmt-client/
   ```
   This re-generates the service and model classes.

In order to try the demonstration, you need to run three applications:

## Running the frontend locally
Should you want to run the frontend on your development machine, you'll have to configure some backend values. Those are stored in `app.config.json`, and
by default contain the following:

```json
{
  "managementApiUrl": "{{managementApiUrl}}",
  "catalogUrl": "{{catalogUrl}}",
  "storageAccount": "{{account}}",
  "storageExplorerLinkTemplate": "storageexplorer://v=1&accountid=/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{account}}&subscriptionid={{subscriptionId}}&resourcetype=Azure.BlobContainer&resourcename={{container}}",
}
```
Substitute the values as necessary:
- `apiKey`: enter here what your EDC instance expects in th `x-api-key` header
- `catalogUrl`: prepend your connector URL, e.g. `http://localhost`, assuming your catalog endpoint is exposed at port 8181, which is the default
- `managementApiUrl`:  prepend your connector URL, e.g. `http://localhost`, assuming your IDS endpoint is exposed at port 9191
- `storageAccount`: insert the name of an Azure Blob Storage account to which the connector has access, otherwise data transfers won't work.

- Clone EDC-Interface and switch to the “w/indexer” branch.
  Follow readme instructions of edc-interface and don't forget to add the Pinata env variable. Finally run the API with `npm run serve`.

- Clone this Data Dashboard Fork and run `npm install -g @angular/cli` to install Angular globally.

## Running a frondend and a connector locally (for demo purpose)
To test the correct functionality locally you can spin up a local docker compose
that will load the `data-dashboard` service and the `connector` one.
First you need to change the `app.config.json` this way:
```json
{
  ...
  "managementApiUrl": "http://consumer-connector/management",
  "catalogUrl": "http://consumer-connector/management",
  ...
}
```

Then you can start the docker compose:
```shell
docker compose up
```

The DataDashboard will be available at `http://localhost:8080`

### Running DataDashboard from the host machine (for debugging purpose)
To have a quicker development cycle, you can also run the DataDashboard from the
host machine using `npm start`, sending request against the connector loaded by
docker compose.
First you need to change the `app.config.json` this way:
```json
{
  ...
  "managementApiUrl": "http://localhost:4200/management",
  "catalogUrl": "http://localhost:4200/management",
  ...
}
```

Then start the local DataDashboard:
```shell
npm start
```

The DataDashboard will be available at `http://localhost:4200`

- Run `npm run start` to host angular frontend

## Support

If there are any problems with installation or deployment, you can write me a mail:
<julian.legler@tu-berlin.de>

If you have any questions regarding the Tezos Client API implementation, feel free to contact me:
<hartmann@tu-berlin.de>

## Motivational Aspects

The docker image is now ready to be deployed to Azure Container Instances (ACI). The `app.config.json` file contains configuration which is fetched by the application at startup. This file can be overridden at deployment time by mounting a secret on `assets/config`. For each deployment you need to provide the corresponding connector backend URL, the storage account name and the API key using this secret. Deploy to ACI using the following command:

```bash
export CONNECTOR_DATA_URL=<CONNECTOR_DATA_URL>
export CONNECTOR_CATALOG_URL=<CONNECTOR_CATALOG_URL>
export STORAGE_ACCOUNT=<STORAGE_ACCOUNT>
export API_KEY=<API_KEY>

# deploy to ACI (when prompted for credentials use the username/password as available in Azure Portal: ACR->Access Keys)
az container create --image ${ACR_NAME}.azurecr.io/edc-showcase/edc-data-dashboard:latest \
--resource-group $RESOURCE_GROUP \
--name edc-data-dashboard \
--secrets "app.config.json"="{\"managementApiUrl\": \"$CONNECTOR_DATA_URL\", \"catalogUrl\": \"$CONNECTOR_CATALOG_URL\", \"storageAccount\": \"$STORAGE_ACCOUNT\", \"apiKey\": \"$API_KEY\"}" \
--secrets-mount-path /usr/share/nginx/html/assets/config \
--dns-name-label edc-data-dashboard
```

## Outlook

- reach higher level of decentralization and independency:
  - replace Pinata API with individual running IPFS nodes
  - replace TzKT API by running a full blockchain node and further implement lightweight blockchain indexer
- enrich blockchain interface functionality to comply with EDC processes:
  - delete/burn tokens (assets, policies and contract offers)
  - transfer tokens to map asset transfer after negotiation phase
  - link identity management to tokens
- analyze operation costs
