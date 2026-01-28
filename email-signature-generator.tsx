import { useState, useEffect } from 'react';

const DEFAULT_LOGO_LIGHT = 'https://drive.google.com/uc?export=view&id=1xMxmUS4Zshaw51om6QQZhVxBjveBQZ6L';
const DEFAULT_LOGO_DARK = 'https://drive.google.com/uc?export=view&id=1DkKreE2U0MKsUybeHnFNnmzPx5xXK76K';

const InputField = ({ label, value, onChange, onClear, placeholder, type = 'text' }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-stone-600 mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all pr-10"
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  </div>
);

const LogoUpload = ({ label, logoUrl, logoName, onUpload, onClear }) => (
  <div>
    <label className="block text-sm font-medium text-stone-600 mb-1.5">{label}</label>
    <div className="relative">
      {logoUrl ? (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-stone-200 rounded-xl">
          <img src={logoUrl} alt="Logo" className="h-8 object-contain" />
          <span className="text-sm text-stone-600 flex-1 truncate">{logoName || 'logo'}</span>
          <button onClick={onClear} type="button" className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-400">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-sm text-stone-500">Subir logo</span>
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      )}
    </div>
  </div>
);

export default function SignatureGenerator() {
  const [form, setForm] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    twitter: '',
    website: '',
    logoLightUrl: DEFAULT_LOGO_LIGHT,
    logoLightName: 'Logo por defecto (claro)',
    logoDarkUrl: DEFAULT_LOGO_DARK,
    logoDarkName: 'Logo por defecto (oscuro)'
  });
  const [darkPreview, setDarkPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const clearField = (field) => setForm(prev => ({ ...prev, [field]: '' }));

  const currentLogo = darkPreview ? form.logoDarkUrl : form.logoLightUrl;

  const defaults = {
    name: 'Eric Y Michelen',
    title: 'Principal and Partner',
    company: 'Michelen Arquitectos',
    phone: '+1 (829) 273-8445',
    website: 'www.michelenarquitectos.com'
  };

  const getValue = (field) => form[field] || defaults[field] || '';

  const generateSignatureHTML = () => {
    const phone = getValue('phone');
    const twitter = form.twitter;
    const title = getValue('title');
    const company = getValue('company');
    const website = getValue('website');
    const websiteHref = website.startsWith('http') ? website : `https://${website}`;

    const contactParts = [];
    if (phone) contactParts.push(`<a href="tel:${phone.replace(/\s/g, '')}" style="color: #6b6b6b; text-decoration: none;">${phone}</a>`);
    if (twitter) contactParts.push(`@${twitter.replace('@', '')}`);
    const contactLine = contactParts.join(' • ');

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.4;">
  <tr>
    <td style="font-weight: 600; color: #1a1a1a; font-size: 15px;">${getValue('name')}</td>
  </tr>
  <tr>
    <td style="color: #6b6b6b; padding-top: 2px;">${title}</td>
  </tr>
  <tr>
    <td style="color: #6b6b6b; padding-top: 2px;">${company}</td>
  </tr>
  ${contactLine ? `<tr>
    <td style="color: #6b6b6b; padding-top: 4px;">${contactLine}</td>
  </tr>` : ''}
  <tr>
    <td style="padding-top: 4px;"><a href="${websiteHref}" target="_blank" style="color: #6b6b6b; text-decoration: none;">${website}</a></td>
  </tr>
  ${currentLogo ? `<tr>
    <td style="padding-top: 12px;">
      <a href="${websiteHref}" target="_blank" style="text-decoration: none;">
        <img src="${currentLogo}" alt="Logo" height="40" style="display: block; border: 0;" />
      </a>
    </td>
  </tr>` : ''}
</table>`;
  };

  const copySignature = async () => {
    const html = generateSignatureHTML();
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([html], { type: 'text/plain' })
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogoUpload = (field, nameField) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, [field]: ev.target.result, [nameField]: file.name }));
      reader.readAsDataURL(file);
    }
  };

  const contactParts = [];
  const previewPhone = getValue('phone');
  const previewTitle = getValue('title');
  const previewCompany = getValue('company');
  const previewWebsite = getValue('website');
  if (previewPhone) contactParts.push(previewPhone);
  if (form.twitter) contactParts.push(`@${form.twitter.replace('@', '')}`);

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className={`max-w-2xl mx-auto transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-stone-800 mb-2">Generador de Firma de Michellen</h1>
          <p className="text-stone-500">Crea una firma profesional en segundos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label="Nombre" value={form.name} onChange={(v) => updateField('name', v)} onClear={() => clearField('name')} placeholder="María García" />
              <InputField label="Cargo" value={form.title} onChange={(v) => updateField('title', v)} onClear={() => clearField('title')} placeholder="Diseñadora de Producto" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label="Empresa" value={form.company} onChange={(v) => updateField('company', v)} onClear={() => clearField('company')} placeholder="Michellen S.A." />
              <InputField label="Teléfono" value={form.phone} onChange={(v) => updateField('phone', v)} onClear={() => clearField('phone')} placeholder="+1 (809) 123-4567" type="tel" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField label="Twitter / X" value={form.twitter} onChange={(v) => updateField('twitter', v)} onClear={() => clearField('twitter')} placeholder="mariag" />
              <InputField label="Sitio Web" value={form.website} onChange={(v) => updateField('website', v)} onClear={() => clearField('website')} placeholder="https://michellen.com" type="url" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <LogoUpload
                label="Logo (modo claro)"
                logoUrl={form.logoLightUrl}
                logoName={form.logoLightName}
                onUpload={handleLogoUpload('logoLightUrl', 'logoLightName')}
                onClear={() => setForm(prev => ({ ...prev, logoLightUrl: '', logoLightName: '' }))}
              />
              <LogoUpload
                label="Logo (modo oscuro)"
                logoUrl={form.logoDarkUrl}
                logoName={form.logoDarkName}
                onUpload={handleLogoUpload('logoDarkUrl', 'logoDarkName')}
                onClear={() => setForm(prev => ({ ...prev, logoDarkUrl: '', logoDarkName: '' }))}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-6 py-3 border-b border-stone-100">
            <span className="text-sm font-medium text-stone-600">Vista previa</span>
            <button
              onClick={() => setDarkPreview(!darkPreview)}
              type="button"
              className={`relative w-14 h-7 rounded-full transition-colors ${darkPreview ? 'bg-stone-700' : 'bg-amber-200'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full transition-all flex items-center justify-center ${darkPreview ? 'left-8 bg-stone-900' : 'left-1 bg-white'}`}>
                {darkPreview ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                )}
              </span>
            </button>
          </div>
          <div className={`p-8 transition-colors ${darkPreview ? 'bg-stone-900' : 'bg-white'}`}>
            <div className="font-sans text-sm leading-relaxed">
              <div className={`font-semibold text-base ${darkPreview ? 'text-white' : 'text-stone-900'}`}>
                {getValue('name')}
              </div>
              <div className={darkPreview ? 'text-stone-400' : 'text-stone-500'}>
                {previewTitle}
              </div>
              <div className={darkPreview ? 'text-stone-400' : 'text-stone-500'}>
                {previewCompany}
              </div>
              {contactParts.length > 0 && (
                <div className={`mt-1 ${darkPreview ? 'text-stone-400' : 'text-stone-500'}`}>
                  {contactParts.join(' • ')}
                </div>
              )}
              <div className={`mt-1 ${darkPreview ? 'text-stone-400' : 'text-stone-500'}`}>
                {previewWebsite}
              </div>
              {currentLogo && (
                <div className="mt-3">
                  <img src={currentLogo} alt="Logo" className="h-10 object-contain" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={copySignature} type="button" className="flex-1 bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
            {copied ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                ¡Copiado!
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Copiar Firma
              </>
            )}
          </button>
          <button onClick={() => setShowModal(true)} type="button" className="bg-white hover:bg-stone-50 text-stone-700 font-medium py-3 px-6 rounded-xl border border-stone-200 transition-colors">
            ¿Cómo importar?
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h2 className="text-lg font-semibold text-stone-800">Cómo Importar Tu Firma</h2>
              <button onClick={() => setShowModal(false)} type="button" className="text-stone-400 hover:text-stone-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full text-xs flex items-center justify-center font-bold">G</span>
                  Gmail
                </h3>
                <ol className="text-sm text-stone-600 space-y-1 ml-8 list-decimal">
                  <li>Abre Gmail y haz clic en el ícono de engranaje → Ver todos los ajustes</li>
                  <li>Desplázate hasta "Firma" y haz clic en "Crear nueva"</li>
                  <li>Pega tu firma copiada en el editor</li>
                  <li>Haz clic en "Guardar cambios" en la parte inferior</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-bold">⌘</span>
                  macOS Mail
                </h3>
                <ol className="text-sm text-stone-600 space-y-1 ml-8 list-decimal">
                  <li>Abre Mail → Configuración → Firmas</li>
                  <li>Selecciona tu cuenta y haz clic en "+" para agregar una firma</li>
                  <li>Pega tu firma copiada</li>
                  <li>Asígnala a tu cuenta desde el menú desplegable</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-stone-100 text-stone-600 rounded-full text-xs flex items-center justify-center font-bold">✉</span>
                  iOS Mail
                </h3>
                <ol className="text-sm text-stone-600 space-y-1 ml-8 list-decimal">
                  <li>Ve a Ajustes → Mail → Firma</li>
                  <li>Selecciona "Por cuenta" si tienes varias cuentas</li>
                  <li>Pega tu firma (el formato puede ser limitado)</li>
                  <li>Para soporte HTML completo, configúrala primero en escritorio</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
