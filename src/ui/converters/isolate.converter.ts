import _ = require('lodash');
import { injectable } from 'inversify';
import { Isolate } from 'src/app/ports';
import {
    CharacteristicsType,
    IsolateConverter,
} from '../model/converter.model';
import {
    IsolateDTO,
    IsolateCharacteristicsDTO,
    IsolateGeneDto,
    IsolateDto,
    GenesCharacteristicsDto,
    IIsolateCharacteristics,
    PhenoTypeCharacteristicsDto,
    SeroTypeCharacteristicsDto,
    SerovarCharacteristicsDto,
    SpaTypeCharacteristicsDto,
    SpeciesCharacteristicsDto,
} from '../model/response.model';

@injectable()
export class DefaultIsolateConverter implements IsolateConverter {
    createIsolateDTOViaIsolate(isolate: Isolate): IsolateDTO {
        const hasGenes = this.hasKeys(isolate.getGenes());
        const hasCharacteristics = this.hasKeys(isolate.getCharacteristics());
        const hasResistences = this.hasKeys(isolate.getResistances());

        const microorganism: string = isolate.microorganism;
        let characteristics: IsolateCharacteristicsDTO | undefined;
        const characteristicType =
            this.getCharacteristicTypeViaMicroorganism(microorganism);
        if (hasCharacteristics && !_.isUndefined(characteristicType)) {
            characteristics = this.createCharacteristicsViaCharacteristicsType(
                characteristicType,
                isolate.getCharacteristics()
            );
        }

        const geneDto = new IsolateGeneDto();
        if (hasGenes) {
            characteristics = _.isUndefined(characteristics)
                ? new IsolateCharacteristicsDTO()
                : characteristics;
            characteristics.genes = geneDto.build(isolate.getGenes());
        }

        let resistance: any;
        if (hasResistences) {
            resistance = isolate.getResistances();
        }

        return new IsolateDto(
            isolate.isolateId,
            isolate.bfrId,
            isolate.microorganism,
            isolate.samplingYear,
            isolate.federalState,
            isolate.samplingContext,
            isolate.samplingStage,
            isolate.origin,
            isolate.category,
            isolate.productionType,
            isolate.matrix,
            isolate.matrixDetail,
            characteristics,
            resistance
        );
    }

    createCharacteristicsViaCharacteristicsType(
        characteristicType: CharacteristicsType,
        partialCharacteristics: Partial<IIsolateCharacteristics>
    ): IsolateCharacteristicsDTO {
        let result: any = null;
        switch (characteristicType) {
            case CharacteristicsType.SPECIES:
                result = new SpeciesCharacteristicsDto().create(
                    partialCharacteristics
                );
                break;
            case CharacteristicsType.SEROVAR:
                result = new SerovarCharacteristicsDto().create(
                    partialCharacteristics
                );
                break;
            case CharacteristicsType.SEROTYPE:
                result = new SeroTypeCharacteristicsDto().create(
                    partialCharacteristics
                );
                break;
            case CharacteristicsType.GENES:
                result = new GenesCharacteristicsDto().create(
                    partialCharacteristics
                );
                break;
            case CharacteristicsType.PHENOTYPE:
                result = new PhenoTypeCharacteristicsDto().create(
                    partialCharacteristics
                );
                break;
            case CharacteristicsType.SPA:
                result = new SpaTypeCharacteristicsDto().create(
                    partialCharacteristics
                );
                break;
            case CharacteristicsType.NONE:
                // no characteristics
                break;
            default:
                throw new Error('Unknown Enum Value.');
        }
        return result;
    }

    private getCharacteristicTypeViaMicroorganism(
        microorganism: string
    ): CharacteristicsType | undefined {
        let result: CharacteristicsType | undefined;
        switch (microorganism) {
            case 'E. coli':
                result = CharacteristicsType.NONE;
                break;
            case 'Campylobacter spp.':
            case 'Enterococcus spp.':
                result = CharacteristicsType.SPECIES;
                break;
            case 'Salmonella spp.':
                result = CharacteristicsType.SEROVAR;
                break;
            case 'ESBL/AmpC-E. coli':
            case 'CARBA-E. coli':
                result = CharacteristicsType.PHENOTYPE;
                break;
            case 'STEC':
                result = CharacteristicsType.GENES;
                break;
            case 'Listeria monocytogenes':
                result = CharacteristicsType.SEROTYPE;
                break;
            case 'MRSA':
                result = CharacteristicsType.SPA;
                break;
            default:
                throw new Error('Unknown Enum Value.');
        }
        return result;
    }

    private hasKeys(obj: any): boolean {
        return null != Object.keys(obj) && 0 < Object.keys(obj).length;
    }
}
