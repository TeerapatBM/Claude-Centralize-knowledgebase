'use client';
import {useI18n} from './i18n';
import {VeltrixSelect} from './veltrix-select';
export function LanguageSwitcher(){const {locale,setLocale,t}=useI18n();return <div className="language-switcher"><label htmlFor="ui-language">{t('ภาษาแสดงผล')}</label><VeltrixSelect id="ui-language" aria-label="Interface language" value={locale} onChange={e=>setLocale(e.target.value as 'th'|'en')}><option value="th">ไทย</option><option value="en">English</option></VeltrixSelect></div>;}
