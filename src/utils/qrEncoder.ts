import { QrConfig } from '../types';

export function generateQrPayload(config: QrConfig): string {
  switch (config.type) {
    case 'url':
      return config.url || 'https://example.com';

    case 'text':
      return config.text || 'Hello from Link to QR!';

    case 'wifi': {
      const { ssid, password, encryption, hidden } = config.wifi;
      if (!ssid) return 'WIFI:S:MyWifiNetwork;T:WPA;P:password123;;';
      return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? 'true' : 'false'};;`;
    }

    case 'email': {
      const { address, subject, body } = config.email;
      if (!address) return 'mailto:contact@example.com';
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (body) params.append('body', body);
      const queryString = params.toString();
      return `mailto:${address}${queryString ? '?' + queryString : ''}`;
    }

    case 'phone':
      return config.phone ? `tel:${config.phone}` : 'tel:+1234567890';

    case 'sms': {
      const { phone, message } = config.sms;
      if (!phone) return 'smsto:+1234567890:Hello!';
      return `smsto:${phone}:${message || ''}`;
    }

    case 'vcard': {
      const { firstName, lastName, organization, title, mobile, email, website, address } = config.vcard;
      const fn = `${firstName || ''} ${lastName || ''}`.trim();
      const nLast = lastName || '';
      const nFirst = firstName || '';
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        (nLast || nFirst) ? `N:${nLast};${nFirst};;;` : '',
        fn ? `FN:${fn}` : '',
        organization ? `ORG:${organization}` : '',
        title ? `TITLE:${title}` : '',
        mobile ? `TEL;TYPE=CELL:${mobile}` : '',
        email ? `EMAIL:${email}` : '',
        website ? `URL:${website}` : '',
        address ? `ADR:;;${address};;;;` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n');
    }

    case 'event': {
      const { title, location, startDate, endDate, description } = config.event;
      const formatIcalDate = (dStr: string) => {
        if (!dStr) return '20260801T100000Z';
        const d = new Date(dStr);
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${title || 'Special Event'}`,
        `LOCATION:${location || 'Main Conference Room'}`,
        `DTSTART:${formatIcalDate(startDate)}`,
        `DTEND:${formatIcalDate(endDate)}`,
        `DESCRIPTION:${description || 'Generated via Link to QR'}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\n');
    }

    case 'appstore': {
      const { iosUrl, androidUrl } = config.appstore;
      return iosUrl || androidUrl || 'https://apps.apple.com/app/id123456789';
    }

    case 'pdf': {
      return config.pdfUrl || 'https://linktoqr.in/doc/sample-presentation.pdf';
    }

    default:
      return config.url || 'https://example.com';
  }
}
