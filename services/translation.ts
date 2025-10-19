import type { EquipmentSlot } from '../types';
import { en } from './translations/en';
import { ua } from './translations/ua';
import { pl } from './translations/pl';
import { es } from './translations/es';
import { de } from './translations/de';
import type { TranslationSchema } from './translations/schema';

export type Language = 'en' | 'ua' | 'pl' | 'es' | 'de';

// Get keys for top-level UI strings, excluding nested objects
type UiKeyHelper<T> = { [K in keyof T]: T[K] extends object ? never : K }[keyof T];
export type UiKey = UiKeyHelper<TranslationSchema>;

export type EquipmentKey = keyof TranslationSchema['equipment'];
export type MobKey = keyof TranslationSchema['mobs'];

const translations: Record<Language, TranslationSchema> = { en, ua, pl, es, de };

export function t(key: UiKey, lang: Language, interpolations?: Record<string, string | number>): string {
    let str = (translations[lang] as any)[key] || (translations.en as any)[key];

    if (typeof str !== 'string') {
        console.warn(`Translation for key '${key}' not found or not a string.`);
        // Fallback to the key itself if it's not a string or not found.
        return String(key);
    }
    
    if (interpolations) {
        Object.entries(interpolations).forEach(([iKey, value]) => {
            str = str.replace(`{${iKey}}`, String(value));
        });
    }
    return str;
}

export function tSlot(slot: EquipmentSlot, lang: Language): string {
    // EquipmentSlot enum values match keys like 'WEAPON', 'SHIELD'
    return t(slot as UiKey, lang);
}

export function tEquip(key: EquipmentKey, lang: Language): string {
    return translations[lang].equipment[key] || translations.en.equipment[key] || 'Unknown Item';
}

export function tMob(key: MobKey, lang: Language, interpolations?: Record<string, string | number>): string {
    let str = translations[lang].mobs[key] || translations.en.mobs[key] || 'Unknown Creature';
     if (interpolations) {
        Object.entries(interpolations).forEach(([iKey, value]) => {
            str = str.replace(`{${iKey}}`, String(value));
        });
    }
    return str;
}