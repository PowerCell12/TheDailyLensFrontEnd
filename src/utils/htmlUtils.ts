export default function getHTMLElements(html: string, amount: number){
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, 'text/html');
    
    // Get the first two top-level element nodes (tags)
    const elements = Array.from(parsedDoc.body.childNodes)
      .filter(node => node.nodeType === Node.ELEMENT_NODE) // Include only element nodes
      .slice(0, amount);
  
    // Create a temporary container to hold the extracted elements
    const fragment = document.createDocumentFragment();
    elements.forEach(element => fragment.appendChild(element.cloneNode(true)));

    const tempDiv = document.createElement('div');
    tempDiv.appendChild(fragment);
    return tempDiv.innerHTML;
}