/**
 * EDC REST API
 * EDC REST APIs - merged by OpenApiMerger
 *
 * The version of the OpenAPI document: 0.0.1-SNAPSHOT
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CriterionDto } from './criterionDto';


export interface ContractDefinitionResponseDto {
    "edc:accessPolicyId"?: string;
    "edc:contractPolicyId"?: string;
    "edc:assetsSelector"?: Array<CriterionDto>;
    "@id"?: string;
}

