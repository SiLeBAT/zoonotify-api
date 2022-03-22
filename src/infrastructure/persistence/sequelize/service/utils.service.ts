import { BidirectionalMap } from '../../../../app/ports';

export const characteristicMap: BidirectionalMap = new BidirectionalMap({
    eae_Gen: 'eae',
    stx2_Gen: 'stx2',
    stx1_Gen: 'stx1',
    H_Gruppe: 'h_group',
    O_Gruppe: 'o_group',
    e_hly_Gen: 'e_hly',
    serovar: 'serovar',
    serotyp: 'serotype',
    spez: 'species',
    spa_Typ: 'spa_type',
    Klonale_Gruppe: 'clonal_group',
    AmpC_Carba_Phänotyp: 'ampc_carba_phenotype',
});
