/**
 * A map of file extensions to their corresponding Flaticon icon URLs.
 */
const ICON_MAP = {
  // ... (same icon map as the previous version)
  pdf: 'https://cdn-icons-png.flaticon.com/512/337/337946.png', docx: 'https://cdn-icons-png.flaticon.com/512/337/337932.png', doc: 'https://cdn-icons-png.flaticon.com/512/337/337932.png', txt: 'https://cdn-icons-png.flaticon.com/512/2911/2911230.png', xlsx: 'https://cdn-icons-png.flaticon.com/512/8243/8243073.png', xls: 'https://cdn-icons-png.flaticon.com/512/4726/4726040.png', csv: 'https://cdn-icons-png.flaticon.com/512/6741/6741152.png', pptx: 'https://cdn-icons-png.flaticon.com/512/337/337958.png', ppt: 'https://cdn-icons-png.flaticon.com/512/1979/1979303.png', jpg: 'https://cdn-icons-png.flaticon.com/512/2306/2306117.png', jpeg: 'https://cdn-icons-png.flaticon.com/512/2306/2306114.png', png: 'https://cdn-icons-png.flaticon.com/128/2306/2306156.png', gif: 'https://cdn-icons-png.flaticon.com/512/337/337940.png', webp: 'https://cdn-icons-png.flaticon.com/512/337/337940.png', svg: 'https://cdn-icons-png.flaticon.com/512/337/337940.png', zip: 'https://cdn-icons-png.flaticon.com/512/888/888879.png', rar: 'https://cdn-icons-png.flaticon.com/512/888/888879.png', mp4: 'https://cdn-icons-png.flaticon.com/512/337/337948.png', avi: 'https://cdn-icons-png.flaticon.com/512/337/337948.png', mov: 'https://cdn-icons-png.flaticon.com/512/337/337948.png', mp3: 'https://cdn-icons-png.flaticon.com/512/337/337941.png', wav: 'https://cdn-icons-png.flaticon.com/512/337/337941.png', default: 'https://cdn-icons-png.flaticon.com/512/136/136549.png',
};

/**

 * @param {Array<Object>} files - Array of file objects. Each object should have { name: string, url: string, size: number (in bytes) }.
 * @returns {string} - A string of HTML ready for email embedding.
 */
export const generateEmailFileCardHTML = (files) => {
  if (!files || !files.length) {
    return '';
  }
  
  // --- HELPER FUNCTIONS ---

  const getFileNameFromUrl = (url = '') => {
    try {
      return decodeURIComponent(url.split('/').pop().split('?')[0]);
    } catch (e) {
      return '';
    }
  };

  const isImage = (fileName = '') => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const getFileIcon = (fileName = '') => {
    const lastDot = fileName.lastIndexOf('.');
    if (lastDot === -1) return ICON_MAP.default;
    const extension = fileName.substring(lastDot + 1).toLowerCase();
    return ICON_MAP[extension] || ICON_MAP.default;
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const shortenName = (name = '', maxLength = 15) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  };

  // --- MAIN LOGIC ---

  const fileCardsHTML = files.map(file => {
    const trueFileName = getFileNameFromUrl(file.url);
    const displayName = file.name;
    const fileIsImage = isImage(trueFileName);
    const iconUrl = getFileIcon(trueFileName);
    const fileSize = formatFileSize(file.size);

    return `
      <!--[if mso | IE]><td style="padding:4px; width:158px;" valign="top"><![endif]-->
        <a href="${file.url}" target="_blank" download title="${displayName}" class="attachment-card" style="display:inline-block; text-decoration:none; width:150px; border:1px solid #dadce0; border-radius:8px; margin:4px; vertical-align:top; background-color:#ffffff; transition: all 0.2s ease-in-out;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-spacing:0;" role="presentation">
            <!-- Row 1: The Preview Area -->
            <tr>
              <td align="center" valign="middle" style="height:100px; background-color:#f1f3f4; border-top-left-radius:8px; border-top-right-radius:8px;">
                ${fileIsImage ?
                  `<img src="${file.url}" alt="Preview" style="display:block; width:100%; height:100px; object-fit:cover; border-top-left-radius:8px; border-top-right-radius:8px;" />` :
                  `<img src="${iconUrl}" alt="File Icon" style="width:48px; height:48px;" />`
                }
              </td>
            </tr>
            <!-- Row 2: The Filename Area -->
            <tr>
              <td style="padding:8px 10px; border-top:1px solid #dadce0;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" role="presentation">
                  <tr>
                    <td style="width:20px; vertical-align:top; padding-top:1px;"><img src="${iconUrl}" alt="icon" style="width:16px; height:16px;"></td>
                    <td style="font-family:Roboto, Arial, sans-serif; padding-left:8px;">
                      <div style="font-size:13px; color:#202124; font-weight:500; line-height:1.4; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${shortenName(displayName)}
                      </div>
                      ${fileSize ? `<div style="font-size:12px; color:#5f6368;">${fileSize}</div>` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </a>
      <!--[if mso | IE]></td><![endif]-->
    `;
  }).join('');

  
  return `
    <style type="text/css">
      .attachment-card:hover {
        border-color: #8ab4f8 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
    </style>
    <div style="padding-top:16px;">
      <!--[if mso | IE]><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><![endif]-->
        ${fileCardsHTML}
      <!--[if mso | IE]></tr></table><![endif]-->
    </div>
  `;
};