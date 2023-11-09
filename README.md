# EDC Data Dashboard

**Please note: This repository does not contain production-grade code and is only intended for demonstration purposes.**

**This fork was modified to work for the specific demonstration of connecting the EDC to the tezos-edc-interface.**

EDC Data Dashboard is a dev frontend application for [EDC Data Management API](https://github.com/eclipse-edc/Connector).

## Docker image

Pre-built docker images can be found in the following Repository: [DataDashboard Image](https://hub.docker.com/repository/docker/johann1999/data-dashboard/general)

Provide environment variables in the docker run command in order to modify the Data Management Url or the Data Catalog Url.

```
docker run --rm -p 3000:80 -e DATA_MANAGEMENT_URL="http://localhost:8182/api/v1/data" -e CATALOG_URL="http://localhost:8181/api/federatedcatalog"  johann1999/data-dashboard:linux-env
```

## Documentation

In order to try the demonstration, you need to run three applications:

1. [EDC Provider](https://github.com/GAIA-X4PLC-AAD/EDC-Blockchain-Catalog)
2. [Tezos-EDC Interface](https://github.com/GAIA-X4PLC-AAD/EDC-Blockchain-Interface)
3. [Frontend](https://github.com/GAIA-X4PLC-AAD/EDC-Blockchain-Dashboard)

### Steps:

- Clone EDC-Interface
  Follow readme instructions of edc-interface and don't forget to add the Pinata env variable. Finally run the API with `npm run serve`.

- Clone this Data Dashboard Fork and run `npm install -g @angular/cli` to install Angular globally.

- Run `npm install` to install all dependencies

- Run `npm run start` to host angular frontend

## Support

If there are any problems with installation or deployment, you can write me a mail:
<julian.legler@tu-berlin.de>


## Motivational Aspects

- Extend EDC functionality by managing and storing assets, policies and contract offerings as NFTs on Tezos blockchain
- Data of assets etc. should be included inside token’s metadata to ensure integrity during negotiation phase
- Implement a blockchain interface to realize minting and token querying functionality
- Optimize token request by adding blockchain indexer → lower response time
- Visualize process of asset, policy and contract offer creation in Data Dashboard → extension and modification is needed

## Outlook

- reach higher level of decentralization and independency:
  - replace Pinata API with individual running IPFS nodes
  - replace TzKT API by running a full blockchain node and further implement lightweight blockchain indexer
- enrich blockchain interface functionality to comply with EDC processes:
  - delete/burn tokens (assets, policies and contract offers)
  - transfer tokens to map asset transfer after negotiation phase
  - link identity management to tokens
- analyze operation costs
