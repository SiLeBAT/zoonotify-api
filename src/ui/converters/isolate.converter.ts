import _ = require('lodash');
import { injectable } from 'inversify';
import { Isolate, IsolateCharacteristicSet } from 'src/app/ports';
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
        const hasCharacteristics = this.hasKeys(isolate.characteristics);
        const hasResistences = this.hasKeys(isolate.resistance);

        let hasGenes = false;
        if (
            !_.isUndefined(isolate.characteristics) &&
            !_.isUndefined(isolate.characteristics.genes)
        ) {
            hasGenes = this.hasKeys(isolate.characteristics.genes);
        }

        const microorganism: string = isolate.microorganism;
        let characteristics: IsolateCharacteristicsDTO | undefined;
        const characteristicType =
            this.getCharacteristicTypeViaMicroorganism(microorganism);
        if (hasCharacteristics && !_.isUndefined(characteristicType)) {
            const tempCharacteristics = isolate.characteristics;
            characteristics = this.createCharacteristicsViaCharacteristicsType(
                characteristicType,
                tempCharacteristics as IsolateCharacteristicSet
            );
        }

        const geneDto = new IsolateGeneDto();
        if (hasGenes) {
            // if characteristics not present -> create an empty characteristics instance
            characteristics = _.isUndefined(characteristics)
                ? new IsolateCharacteristicsDTO()
                : characteristics;
            if (
                !_.isUndefined(isolate.characteristics) &&
                !_.isUndefined(isolate.characteristics.genes)
            ) {
                // put genes
                const genes = isolate.characteristics.genes;
                characteristics.genes = geneDto.build(genes);
            }
        }

        let resistance: any;
        if (hasResistences) {
            resistance = isolate.resistance;
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
        characteristics: IsolateCharacteristicSet | undefined
    ): IsolateCharacteristicsDTO {
        let result: any = null;
        const _characteristics = characteristics as IIsolateCharacteristics;
        switch (characteristicType) {
            case CharacteristicsType.SPECIES:
                result = new SpeciesCharacteristicsDto().create(
                    _characteristics
                );
                break;
            case CharacteristicsType.SEROVAR:
                result = new SerovarCharacteristicsDto().create(
                    _characteristics
                );
                break;
            case CharacteristicsType.SEROTYPE:
                result = new SeroTypeCharacteristicsDto().create(
                    _characteristics
                );
                break;
            case CharacteristicsType.GENES:
                result = new GenesCharacteristicsDto().create(_characteristics);
                break;
            case CharacteristicsType.PHENOTYPE:
                result = new PhenoTypeCharacteristicsDto().create(
                    _characteristics
                );
                break;
            case CharacteristicsType.SPA:
                result = new SpaTypeCharacteristicsDto().create(
                    _characteristics
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
        return (
            null != obj &&
            null != Object.keys(obj) &&
            0 < Object.keys(obj).length
        );
    }
}
