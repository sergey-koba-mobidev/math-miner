
export const formatStatForModal = (key: string, value: number) => {
    switch (key) {
        case 'maxHp': return `+${value} HP`;
        case 'attack': return `+${value} ATK`;
        case 'defense': return `+${value} DEF`;
        case 'evasion': return `+${value}% EVA`;
        case 'critChance': return `+${value}% CRIT`;
        default: return '';
    }
}
