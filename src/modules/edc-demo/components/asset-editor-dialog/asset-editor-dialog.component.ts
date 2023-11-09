import { Component, Inject, OnInit } from '@angular/core';
import { AssetInput } from "@think-it-labs/edc-connector-client";
import { MatDialogRef } from "@angular/material/dialog";
import { StorageType } from "../../models/storage-type";


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
  account: string = '';
  container: string = 'src-container';

  originator: string = 'http://connector-1:8282/api/v1/ids/data';
  baseUrl: string = "http://techslides.com/demos/samples/sample.txt";

  gaiaxSelfdescription: string = "";
  gaiaxSelfdescriptionJson: any = {};

  updateGaiaxSelfDescription() {
    this.gaiaxSelfdescription = `{
      "@context": {
      "cc": "http://creativecommons.org/ns#",
      "schema": "http://schema.org/",
      "void": "http://rdfs.org/ns/void#",
      "owl": "http://www.w3.org/2002/07/owl#",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "skos": "http://www.w3.org/2004/02/skos/core#",
      "voaf": "http://purl.org/vocommons/voaf#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "vcard": "http://www.w3.org/2006/vcard/ns#",
      "gax-core": "http://w3id.org/gaia-x/core#",
      "dct": "http://purl.org/dc/terms/",
      "sh": "http://www.w3.org/ns/shacl#",
      "gax-trust-framework": "http://w3id.org/gaia-x/gax-trust-framework#",
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "ids": "https://w3id.org/idsa/core/",
      "dcat": "http://www.w3.org/ns/dcat#",
      "vann": "http://purl.org/vocab/vann/",
      "foaf": "http://xmlns.com/foaf/0.1/",
      "did": "https://www.w3.org/TR/did-core/#",
      "openlabel": "https://openlabel.asam.net/V1-0-0/ontologies/",
      "plc": "https://ivi.fraunhofer.de/V1-0-0/plc/"
  },
  "@id": "did:example:ivi.fraunhofer.de/plc/Scenarios/${this.id}",
  "@type": "plc:ScenarioDataResource",
  "gax-trust-framework:name": "${this.id}",
  "gax-trust-framework:producedBy": {
      "@id": "did:example:ivi.fraunhofer.de"
  },
  "gax-trust-framework:copyrightOwnedBy": {
      "@type": "foaf:Agent",
      "foaf:name": {
          "@value": "did:example:bmw.de",
          "@type": "xsd:string"
      }
  },
  "dct:description": {
      "@value": "https://gitlab-extern.ivi.fraunhofer.de/gaiax/gaiax_ontology/-/blob/Nicolas/Scenarios/ALKS_Scenario_4.1_1_FreeDriving_TEMPLATE.xosc",
      "@type": "xsd:string"
  },
  "gax-trust-framework:license": {
      "@value": "https://creativecommons.org/licenses/by-sa/4.0/legalcode",
      "@type": "xsd:string"
  },
  "openlabel:scenarioName": {
      "@value": "Just for testing purposes",
      "@type": "xsd:string"
  },
  "openlabel:ownerName": {
      "@value": "BMW AG",
      "@type": "xsd:string"
  },
  "openlabel:scenarioCreatedDate": {
      "@value": "2021-07-09T10:00:00",
      "@type": "xsd:string"
  },
  "openlabel:hasTag": [
      {
          "@type": "openlabel:MotionDrive",
          "openlabel:motionDriveValue": {
              "@value": "60",
              "@type": "xsd:decimal"
          }
      },
      {
          "@type": "openlabel:SubjectVehicleSpeed",
          "openlabel:subjectVehicleSpeedValue": {
              "@value": "60",
              "@type": "xsd:decimal"
          }
      },
      {
          "@type": "openlabel:LaneSpecificationLaneCount",
          "openlabel:laneSpecificationLaneCountValue": {
              "@value": "3",
              "@type": "xsd:decimal"
          }
      },
      {
          "@type": "openlabel:TrafficAgentDensity",
          "openlabel:trafficAgentDensityValue": {
              "@value": "1",
              "@type": "xsd:decimal"
          }
      }
  ]
  }`;
    this.gaiaxSelfdescriptionJson = JSON.parse(this.gaiaxSelfdescription);
  }

  originator: string = 'http://localhost:8184/protocol';
  baseUrl: string = "http://techslides.com/demos/samples/sample.txt";


  constructor(private dialogRef: MatDialogRef<AssetEditorDialog>,
      @Inject('STORAGE_TYPES') public storageTypes: StorageType[]) {
  }

  ngOnInit(): void {
    this.updateGaiaxSelfDescription();
  }

  onSave() {
    const assetInput: AssetInput = {
      "@id": this.id,
      properties: {
        "name": this.name,
        "version": this.version,
        "contenttype": this.contenttype,
        "originator": this.originator,
      },
      dataAddress: {
        "type": this.storageTypeId,
        "name": this.id,
        "baseUrl": this.baseUrl,
        //"account": this.account,
        //"container": this.container,
        //"blobname": this.blobname,
        //"keyName": `${this.account}-key1`
      }
    };

    this.dialogRef.close({ assetInput });
  }
}
