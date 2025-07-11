export const generateEmailFileCardHTML = (files) => {
  if (!files.length) return '';

  function shortenName(name, maxLength = 25) {
    const [baseName, ext] = name.split(/\.(?=[^\.]+$)/); // splits only at last dot
    if (baseName.length <= maxLength) return name;
    return `${baseName.slice(0, maxLength)}...${ext ? '.' + ext : ''}`;
  }

  return `
    <hr style="margin:16px 0;">
    <h3 style="margin-bottom:10px;font-family:sans-serif;">
      📎 Attached Files
    </h3>
    <div style="font-family:sans-serif;">
      ${files.map(file => `
        <a href="${file.url}" target="_blank" download title="${file.name}" 
           style="
             display: inline-block;
             vertical-align: top;
             width: 45%;
             min-width: 150px;
             margin: 5px;
             border: 1px solid #ddd;
             border-radius: 6px;
             padding: 10px 12px;
             background: #f9f9f9;
             font-size: 14px;
             box-sizing: border-box;
             text-decoration: none;
             color: #000;
             font-family: sans-serif;
           ">
          <div style="display: flex; align-items: center;">
            <img src="https://img.icons8.com/ios-filled/18/000000/document--v1.png" 
                 alt="Download" style="margin-right: 10px; flex-shrink: 0;" />
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${shortenName(file.name)}
            </div>
          </div>
        </a>
      `).join('')}
    </div>
  `;
};
