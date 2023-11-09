import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {catchError, map, reduce} from 'rxjs/operators';
import {Asset} from '../models/asset';
import {ContractOffer} from '../models/contract-offer';
import {
  ContractNegotiationDto,
  ContractNegotiationService,
  NegotiationInitiateRequestDto,
  Policy,
  TransferProcessDto,
  TransferProcessService,
  TransferRequestDto,
} from "../../mgmt-api-client";
import {CONNECTOR_CATALOG_API, CONNECTOR_MANAGEMENT_API} from "../../app/variables";
import TypeEnum = Policy.TypeEnum;


/**
 * Combines several services that are used from the {@link CatalogBrowserComponent}
 */
@Injectable({
  providedIn: 'root'
})
export class CatalogBrowserService {

  constructor(private httpClient: HttpClient,
              private transferProcessService: TransferProcessService,
              private negotiationService: ContractNegotiationService,
              @Inject(CONNECTOR_MANAGEMENT_API) private managementApiUrl: string,
              @Inject(CONNECTOR_CATALOG_API) private catalogApiUrl: string) {
  }

  getContractOffers(): Observable<ContractOffer[]> {
    let url = this.catalogApiUrl || this.managementApiUrl;
    return this.post<ContractOffer[]>(url + "/federatedcatalog")
    .pipe(
      map((data: any) => {
        let dataservice = data["dcat:service"];
        let dataset = data["dcat:dataset"];

        console.log("ResponseBody: ");
        console.log(data);
        console.log("Datasets Array: ");
        console.log(dataset);
        console.log("Dataservices Array: ");
        console.log(dataservice);

        const arr = Array<ContractOffer>();

        // Check if dataset is an array and has elements
        if (Array.isArray(dataset) && dataset.length > 0) {
          for (let i = 0; i < dataset.length; i++) {
            const offering: any = dataset[i];
            const properties: { [key: string]: string } = {
              "edc:id": offering["edc:id"],
              "edc:name": offering["edc:name"],
              // no version in the new format
              "edc:version": "",
              "type": offering["@type"],
              "edc:contenttype": offering["edc:contenttype"],
              // not sure what is supposed to map to originatior, so just put the id again
              "edc:originator": offering["edc:originator"]
            };
            const asset: Asset = new Asset(properties);

            let policy: Policy = {
              // Currently hardcoded to SET since parsed type is {"@policytype": "set"}
              "@type": TypeEnum.Set,
              "@id": offering["odrl:hasPolicy"]["@id"],
              // No assignee or assigner in DCAT
              "odrl:obligation": offering["odrl:hasPolicy"]["odrl:obligation"],
              "odrl:permission": offering["odrl:hasPolicy"]["odrl:permission"],
              "odrl:prohibition": offering["odrl:hasPolicy"]["odrl:prohibition"],
              "odrl:target": offering["odrl:hasPolicy"]["odrl:target"]
            };

            const newContractOffer: ContractOffer = {
              asset: asset,
              contractOffers: [],
              "dcat:dataset": [],
              id: offering["odrl:hasPolicy"]["@id"],
              "edc:originator": offering["edc:originator"],
              policy: policy,
              //dcat:service property is not an array, just a single service...for now hardcoded to first dataservice
              'dcat:service': {
                id: dataservice["@id"],
                terms: dataservice["dct:terms"],
                endpointUrl: dataservice["dct:endpointUrl"]
              }
            };
            arr.push(newContractOffer);
          }
        } else {
          // Handle the case when data is empty (no elements)
          console.log("catalogue is empty");
        }
        return arr;
      })
    )
  };

  initiateTransfer(transferRequest: TransferRequestDto): Observable<string> {
    return this.transferProcessService.initiateTransfer(transferRequest).pipe(map(t => t["@id"]!))
  }

  getTransferProcessesById(id: string): Observable<TransferProcessDto> {
    return this.transferProcessService.getTransferProcess(id);
  }

  initiateNegotiation(initiateDto: NegotiationInitiateRequestDto): Observable<string> {
    return this.negotiationService.initiateContractNegotiation(initiateDto, 'body', false,).pipe(map(t => t["@id"]!))
  }

  getNegotiationState(id: string): Observable<ContractNegotiationDto> {
    return this.negotiationService.getNegotiation(id);
  }

  private post<T>(urlPath: string,
                  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; })
    : Observable<T> {
    const url = `${urlPath}`;
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this.catchError(this.httpClient.post<T>(url, "{\"edc:operandLeft\": \"\",\"edc:operandRight\": \"\",\"edc:operator\": \"\",\"edc:Criterion\":\"\"}", {headers, params}), url, 'POST');
  }

  private catchError<T>(observable: Observable<T>, url: string, method: string): Observable<T> {
    return observable
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (httpErrorResponse.error instanceof Error) {
            console.error(`Error accessing URL '${url}', Method: 'GET', Error: '${httpErrorResponse.error.message}'`);
          } else {
            console.error(`Unsuccessful status code accessing URL '${url}', Method: '${method}', StatusCode: '${httpErrorResponse.status}', Error: '${httpErrorResponse.error?.message}'`);
          }

          return EMPTY;
        }));
  }
}
