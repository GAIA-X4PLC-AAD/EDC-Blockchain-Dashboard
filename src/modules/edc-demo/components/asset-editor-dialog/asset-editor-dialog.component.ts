import { environment } from 'src/environments/environment';
import { Component, Inject, OnInit } from '@angular/core';
import { AssetInput } from "@think-it-labs/edc-connector-client";
import { MatDialogRef } from "@angular/material/dialog";
import { StorageType } from "../../models/storage-type";
import { NotificationService } from "../../services/notification.service";
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmDialogModel } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'edc-demo-asset-editor-dialog',
  templateUrl: './asset-editor-dialog.component.html',
  styleUrls: ['./asset-editor-dialog.component.scss']
})
export class AssetEditorDialog implements OnInit {

  id: string = '';
  version: string = '';
  name: string = '';
  contenttype: string = '';

  storageTypeId: string = 'HttpData';
  account: string = 'msgedcstorage';
  container: string = 'src-container';
  blobname: string = '';

  originator: string = 'http://connector-1:8184/protocol';
  originatorExamples: string[] = [
    'http://connector-1:8184/protocol',
    'https://edc-pr.gxfs.gx4fm.org/api/v1/dsp'
  ];
  baseUrl: string = "http://techslides.com/demos/samples/sample.txt";

  claimsList: string = "";
  claimsListJson: any = {};
  gxParticipantCredentials: string = "";
  gxParticipantCredentialsJson: any = {};
  claimComplianceProviderResponse: string = "";
  claimComplianceProviderCheckboxChecked: boolean = false;

  isLoading: boolean = false;

  claimComplianceProviderEndpoint = environment.claimComplianceProviderEndpoint;

  constructor(private dialogRef: MatDialogRef<AssetEditorDialog>,
              @Inject('STORAGE_TYPES') public storageTypes: StorageType[],
              private notificationService: NotificationService,
              private http: HttpClient,
              private dialog: MatDialog) {

  }

  private showError(error: string, errorMessage: string) {
    this.notificationService.showError(errorMessage);
    console.error(error);
  }

  private initClaimsList() {
    this.claimsList = `
      [
        {
          "@context": {
            "gx": "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          },
          "@id": "https://www.gaia-x4plcaad.info/claims/virtual-resource/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f",
          "@type": "gx:InstantiatedVirtualResource",
          "gx:maintainedBy": {
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json"
          },
          "gx:hostedOn": {
            "id": "https://www.gaia-x4plcaad.info/claims/physical-resource/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f"
          },
          "gx:instanceOf": {
            "id": "https://www.gaia-x4plcaad.info/claims/data-resource/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f"
          },
          "gx:tenantOwnedBy": {
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json"
          },
          "gx:serviceAccessPoint": {
            "id": "https://www.gaia-x4plcaad.info/claims/service-access-point/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f"
          }
        },
        {
          "@context": {
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "gx": "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          },
          "@id": "https://www.gaia-x4plcaad.info/claims/service-offering/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f",
          "@type": "gx:ServiceOffering",
          "gx:dataAccountExport": {
            "gx:requestType": "API",
            "gx:formatType": {
              "@value": "application/json",
              "@type": "xsd:string"
            },
            "gx:accessType": "digital"
          },
          "gx:termsAndConditions": {
            "gx:hash": {
              "@value": "d056db972da41899ed89cd3f93b8ccd59fc9314e2904af3455ce13d76a2ed99b",
              "@type": "xsd:string"
            },
            "gx:URL": {
              "@value": "https://www.msg.group/sotermsandconditions",
              "@type": "xsd:string"
            }
          },
          "gx:policy": {
            "@value": "package access_control default allow = false  allow { input.method == \\"GET\\" input.path == /public } allow { input.method == \\"POST\\"     input.path == \\"/private\\"     input.user.role == \\"admin\\" }",
            "@type": "xsd:string"
          },
          "gx:providedBy": {
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json"
          }
        },
        {
          "@context": {
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "gx": "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          },
          "@id": "https://www.gaia-x4plcaad.info/claims/data-resource/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f",
          "@type": "gx:DataResource",
          "gx:copyrightOwnedBy": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json",
          "gx:license": "Apache-2.0",
          "gx:obsoleteDateTime": {
            "@value": "2025-04-08T14:25:58",
            "@type": "xsd:dateTime"
          },
          "gx:exposedThrough": {
            "id": "https://www.gaia-x4plcaad.info/claims/service-offering/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f"
          },
          "gx:expirationDateTime": {
            "@value": "2025-04-08T14:25:58",
            "@type": "xsd:dateTime"
          },
          "gx:containsPII": false,
          "gx:policy": {
            "@value": "package access_control  default allow = false  allow {     input.method == \\"GET\\"     input.path == \\"/public\\" }  allow {     input.method == \\"POST\\"     input.path == \\"/private\\"     input.user.role == \\"admin\\" }",
            "@type": "xsd:string"
          },
          "gx:producedBy": {
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json"
          },
          "gx:name": {
            "@value": "Generated Data Resource",
            "@type": "xsd:string"
          },
          "gx:description": {
            "@value": "Generated description.",
            "@type": "xsd:string"
          }
        },
        {
          "@context": {
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "gx": "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#"
          },
          "@id": "https://www.gaia-x4plcaad.info/claims/service-access-point/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f",
          "@type": "gx:ServiceAccessPoint",
          "gx:name": {
            "@value": "Provider EDC",
            "@type": "xsd:string"
          },
          "gx:host": {
            "@value": "edcdb-pr.gxfs.gx4fm.org/",
            "@type": "xsd:string"
          },
          "gx:protocol": {
            "@value": "https",
            "@type": "xsd:string"
          },
          "gx:version": {
            "@value": "0.2.1",
            "@type": "xsd:string"
          },
          "gx:port": {
            "@value": "443",
            "@type": "xsd:string"
          },
          "gx:openAPI": {
            "@value": "https://app.swaggerhub.com/apis/eclipse-edc-bot/management-api/0.2.1",
            "@type": "xsd:string"
          }
        },
        {
          "@context": {
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "gx": "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          },
          "@id": "https://www.gaia-x4plcaad.info/claims/physical-resource/fe9f0d7f-3a80-48ef-9630-a7c9c3c1e78f",
          "@type": "gx:PhysicalResource",
          "gx:maintainedBy": {
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json"
          },
          "gx:ownedBy": {
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json"
          },
          "gx:manufacturedBy": {
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json"
          },
          "gx:location": {
            "@value": "DE",
            "@type": "xsd:string"
          },
          "gx:name": {
            "@value": "Generated PhysicalResource",
            "@type": "xsd:string"
          },
          "gx:description": {
            "@value": "Generated PhysicalResource Description.",
            "@type": "xsd:string"
          }
        }
      ]
    `
  }

  private initGxParticipantCredentials() {
    this.gxParticipantCredentials = `
      [
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/security/suites/jws-2020/v1",
            "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#"
          ],
          "type": [
            "VerifiableCredential"
          ],
          "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json",
          "issuer": "did:web:participant.gxfs.gx4fm.org:msg-systems-ag",
          "issuanceDate": "2024-06-23T17:00:18.698Z",
          "credentialSubject": {
            "type": "gx:LegalParticipant",
            "gx:legalName": "msg systems ag",
            "gx:legalRegistrationNumber": {
              "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalRegistration.json"
            },
            "gx:headquarterAddress": {
              "gx:countrySubdivisionCode": "DE-BY"
            },
            "gx:legalAddress": {
              "gx:countrySubdivisionCode": "DE-BY"
            },
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalParticipant.json"
          },
          "proof": {
            "type": "JsonWebSignature2020",
            "created": "2024-06-23T19:00:18.709+02:00",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:web:participant.gxfs.gx4fm.org:msg-systems-ag#JWK2020-RSA",
            "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..VgwUGGuUi8ZCjFGE39mTs3GHIhVLjOVi8_ki0zUeC-2RHKFGGEJb5iehYKC9AQXOV071R7lk1uudDUCwmjwtG8LJc3ExpWnuPgRdkiybSJbGTf3b_7akHDIiMUPL0r1RFjdJBxIM_DohDqRaPQkhB7nV0e5-daOmeIexgAsXHg8xG4RSK_Lu3liw3UcwUfYRtNLn7txghpZN7EIBzcpcxhc3yc6-ZxVNZfQHq1uelz-iHwke42hd2qZ1Qfy4mZQXyfIuCvo_O0q59QGa6f6VBvdHcejFxpjLd4Vl_bMAzdPy1mLefsjLVNQPj-2Dxbt5Jvy77lqd37bR_SdU2A6DogUCycHHrqc0Bd8-Ek69Tuz5yKUaGo03sceRUoWupEXKID6gPYuPoPuZnpIIlNkc_cKYZEG-WIeK_7nd-PfQ2470hAIqz4CVu1hapVRjOxMEuANJhXCgGLwJsDJBySwJ9c7T64gYRZKq4qUaGYw8ovT_clVdeVRNhZOopduh14U9zCvRjYU8zNHPrkMsVQJIP2Jt0y0cb7uLH2SQz2JtK3zdT8IFWtiYNZFpHgWtrjsEb0BtjgvgApwGrscPOHy7k4qiou4RC2JoSKtgzmn_9ivtcemdKTcaZIzrE8qSoRrITUl2Lis0daf1kkIKzrqaP67efJoh-wUnZGYxn6VE7mM"
          }
        },
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/security/suites/jws-2020/v1"
          ],
          "type": [
            "VerifiableCredential"
          ],
          "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalRegistration.json",
          "issuer": "did:web:registration.lab.gaia-x.eu:v1-staging",
          "issuanceDate": "2024-06-11T10:41:04.368Z",
          "credentialSubject": {
            "@context": "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#",
            "type": "gx:legalRegistrationNumber",
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/legalRegistration.json",
            "gx:vatID": "DE129420400",
            "gx:vatID-countryCode": "DE"
          },
          "evidence": [
            {
              "gx:evidenceURL": "http://ec.europa.eu/taxation_customs/vies/services/checkVatService",
              "gx:executionDate": "2024-06-11T10:41:04.368Z",
              "gx:evidenceOf": "gx:vatID"
            }
          ],
          "proof": {
            "type": "JsonWebSignature2020",
            "created": "2024-06-11T10:41:04.382Z",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:web:registration.lab.gaia-x.eu:v1-staging#X509-JWK2020",
            "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..BZLcUJsjZdTeEvgnGjuGXJ2JZCPhdvfbKQjmPgLA0sl93Nf-d79pZkvzg_PHEYRL9REIqysPb2jtEVc_LI17YBc0ZTvHNZw9T9PjfervYFw6pXqID1jXb_lbWabIP1YlxR5AA5uBXoENLuT-GFUyQ7hwMTPakQxvl5pR3jiLJT7brIbtbhoyqX7_nYVpJPxFVcufL9mMkxwlX1x5j9HoVPNCjexlCj0mXq4gDT583SEXlGkbIMUaD9XJlZbp2xyeBIb_luF2LyS2cmbSDjONbppQvrVwnMuyRuexbtc58EBlh7UvmYHemij6JxtYWjBR8axnRBz-4_DviYiaJ3pmJg"
          }
        },
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/security/suites/jws-2020/v1",
            "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#"
          ],
          "type": "VerifiableCredential",
          "issuanceDate": "2024-06-21T21:15:30.081Z",
          "credentialSubject": {
            "gx:termsAndConditions": "The PARTICIPANT signing the Self-Description agrees as follows:\\n- to update its descriptions about any changes, be it technical, organizational, or legal - especially but not limited to contractual in regards to the indicated attributes present in the descriptions.\\n\\nThe keypair used to sign Verifiable Credentials will be revoked where Gaia-X Association becomes aware of any inaccurate statements in regards to the claims which result in a non-compliance with the Trust Framework and policy rules defined in the Policy Rules and Labelling Document (PRLD).",
            "type": "gx:GaiaXTermsAndConditions",
            "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/termsAndConditions.json"
          },
          "issuer": "did:web:participant.gxfs.gx4fm.org:msg-systems-ag",
          "id": "https://participant.gxfs.gx4fm.org/msg-systems-ag/termsAndConditions.json",
          "proof": {
            "type": "JsonWebSignature2020",
            "created": "2024-06-21T23:15:31.464+02:00",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:web:participant.gxfs.gx4fm.org:msg-systems-ag#JWK2020-RSA",
            "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..MUqvGwsKRwS4SGxVfIS8iMoQwHiMtQlcPeP-Hm2ywiNFHTnI3IY9gon94Mib4jQJ3ExG1YISAjtCH8iidQurlEzlKz5v3frKl1gFS1p-3IWWrIGBChZ_XUZZUdPq0EQ6B-nZdaewwS8vfCtP82IFmXz-jaA0SOAxxuGXxa6xoHt3WbzAEQtEeItqS7my4BNWlSaeMKr-JCWbih-wPSy3ZpXjKwdYOo972yZYj-YP6OVtJe0iTnpazHrGjnkNZmi8tzlTuE691pQH2iM8CG5jQqG_ue38Z7YqPpUghWvpZYgJ6O8yeSqrpeJ8NrmN0NdN5wJRySOuOwzhqSuwsNP4X6yWBEo9bkEJAok0bN-9X7RQm5INUkRxk68_BHZga6lsvvLz2pqgModf2btXRHJhqUYF7Z2BsikcwzhPTnyTAms9q1AovJIx3ypDlNVOUMS24uLqBM713Z17a9qxEUC94WWpXjSXCVLe4FK-26TenYYKdWue3vtaoWDonPSnMN90XmQirvRv0YcLvBQNZ8JNFUe7Et22p8PZUeVcu-YjULRWrGgdk-kWQgCsEQraM13gHNzyKxHUgDG_pco3QIgNsbbOIdEdv8CS4mzm_NApLufRMOUIsjBf7nOe8RewebmgwPeXXqdxLo9xaBb77dwj45Cj6Y2Wjr4O4Cbp9PI9VJ8"
          }
        }
      ]
    `
  }

  checkAndAssignClaimsList(): void {
    try {
      this.claimsListJson = JSON.parse(this.claimsList);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      this.showError(errorMessage, 'Error parsing claims list. Please check the format.');
      this.claimsListJson = {};
    }

  }
  checkAndAssignGxParticipantCredentials(): void {
    try {
      this.gxParticipantCredentialsJson = JSON.parse(this.gxParticipantCredentials);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      this.showError(errorMessage, 'Error parsing participants list. Please check the format.');
      this.gxParticipantCredentialsJson = {};
    }
  }

  ngOnInit(): void {
    this.claimComplianceProviderResponse = "";
    this.updateCheckboxState();
    this.initClaimsList();
    this.initGxParticipantCredentials();
    this.checkAndAssignClaimsList();
    this.checkAndAssignGxParticipantCredentials();
  }

  onCheckCompliance(): void {
    console.log('Checking compliance...');
    // Check if claimsListJson and gxParticipantCredentialsJson are not empty objects
    if (! this.checkForValidJson()) {
      return; // Stop execution if validation fails
    }

    // prepare payload
    const payload = {
      claims: this.claimsListJson,
      verifiableCredentials: this.gxParticipantCredentialsJson
    };

    this.notificationService.showInfo("Compliance check started. This may take a while...");
    this.isLoading = true;
    this.http.post(this.claimComplianceProviderEndpoint, payload).subscribe({
      next: (response: any) => {
        console.log('Compliance check successful', response);
        this.claimComplianceProviderResponse = JSON.stringify(response);
        this.updateCheckboxState();
        this.notificationService.showInfo("Compliance check successful!");
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Compliance check failed', error);
        let messageToShow = "Compliance check failed: ";
        // Check if the error response body exists and contains the required fields
        if (error && error.error) {
          const errorBody = error.error;
          if (errorBody.message) {
            messageToShow += '\n\nMessage: ' + errorBody.message;
          }
          if (errorBody.errorDetails) {
            messageToShow += '\n\nError Details: ' + errorBody.errorDetails;
          }
          if (errorBody.exceptionMessage) {
            messageToShow += '\n\nException Message: ' + errorBody.exceptionMessage;
          }
        } else {
          // Fallback message if the error structure is not as expected
          messageToShow += 'An unexpected error occurred.';
        }
        this.showError("Error checking compliance", messageToShow);
        this.claimComplianceProviderResponse = "";
        this.updateCheckboxState();
        this.isLoading = false;
      }
    });
  }

  onSave() {
    // Check if claimsListJson and gxParticipantCredentialsJson are not empty objects
    if (!this.checkForValidJson()) {
      return; // Stop execution if validation fails
    }

    // Check if claimComplianceProviderResponse is empty
    if (this.claimComplianceProviderResponse === "") {
      const dialogData = new ConfirmDialogModel("Confirmation needed",
        "The compliance check has not been performed. Do you want to proceed?");
      dialogData.confirmText = "Yes";
      dialogData.cancelText = "No";
      dialogData.confirmColor = "warn";

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: dialogData
      });

      dialogRef.afterClosed().subscribe((result:boolean) => {
        if (result) {
          console.log('User confirmed action');
          this.proceedWithSave();
        } else {
          console.log('User cancelled action');
        }
      });
    }
    else {
      this.proceedWithSave();
    }
  }

  private proceedWithSave() {
    // Base64 encode claimsList and gxParticipantCredentials since EDC backend cannot handle nested json :(
    const encodedComplianceProviderResponse = btoa(this.claimComplianceProviderResponse);
    const encodedClaimsList = btoa(this.claimsList);
    const encodedGxParticipantCredentials = btoa(this.gxParticipantCredentials);

    const assetInput: AssetInput = {
      "@id": this.id,
      properties: {
        "name": this.name,
        "version": this.version,
        "contenttype": this.contenttype,
        "originator": this.originator,
        "claimComplianceProviderResponse": encodedComplianceProviderResponse,
        "claimsList": encodedClaimsList,
        "gxParticipantCredentials": encodedGxParticipantCredentials
      },
      dataAddress: {
        "type": this.storageTypeId,
        "name": this.id,
        "baseUrl": this.baseUrl,
        "account": this.account,
        "container": this.container,
        "blobname": this.blobname,
        "keyName": `${this.account}-key1`
      }
    };
    this.dialogRef.close({assetInput});
  }

  private checkForValidJson()  {
    // Check if claimsListJson is an empty object
    if (Object.keys(this.claimsListJson).length === 0) {
      this.showError("Validation Error", "Value in field Claims List is not a valid json string. Please check the format.");
      return false;
    }

    // Check if gxParticipantCredentialsJson is an empty object
    if (Object.keys(this.gxParticipantCredentialsJson).length === 0) {
      this.showError("Validation Error", "Value in field Participant Credentials is not a valid json string. Please check the format.");
      return false
    }
    return true;
  }

  updateCheckboxState(): void {
    this.claimComplianceProviderCheckboxChecked = !!(this.claimComplianceProviderResponse && this.claimComplianceProviderResponse.length > 0);
  }
}
