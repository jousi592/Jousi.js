let styleExists = false;
let styledElements = [];
let classes = [];
let ids = [];
 
const Create = (ObjectOfTags = {}, ArrayOfProperties) => {
  this.elements = [];
  this.newElements = [];
  this.styleName;
  this.animationName;
  this.animationExtensions = ["","-webkit-", "-moz-", "-o-"]
  this.root = document.querySelector(".root");
  this.htmlTags = ["a", "abbr", "address","area", "article",  "aside",  "audio",  "b",  "base", "bdi",  "bdo",  "blockquote", "body", "br", "button", "canvas", "caption",  "cite", "code", "col",  "colgroup", "data", "datalist", "dd",
  "del",  "details",  "dfn",  "dialog", "div",  "dl", "dt", "em", "embed",  "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i",  "iframe", "img",
  "input",  "ins",  "kbd",  "keygen", "label",  "legend", "li", "link", "main", "map",  "mark", "math", "menu", "menuitem", "meta", "meter",  "nav",  "noscript", "object", "ol", "optgroup", "option", "output", "p",
  "param",  "picture",  "pre",  "progress", "q",  "rb", "rp", "rt", "rtc",  "ruby", "s",  "samp", "script", "section",  "select", "small",  "source", "span", "strong", "style",  "sub",  "summary",  "sup",  "svg",  "table",
  "tbody",  "td", "template", "textarea", "tfoot",  "th", "thead",  "time", "title",  "tr", "track",  "u",  "ul", "var",  "video",  "wbr"];
  sortElements(ObjectOfTags);
  render(this.elements);
  insertProperties(this.newElements, ArrayOfProperties);
  function sortElements (object) {
    for(key in object){
      let parent = {};
      parent.elName = key;
      parent.children = [];
      for(let i = 0; i < object[key].length; i++){
        let element = object[key][i];
        parent.children.push(element);
      }
      this.elements.push(parent);
    }
  }
  // Creates defined elements
  function render (object){
    for(key in object){
      let parentName = object[key].elName;
      let parentObject;
      if(parentName.includes("c:")){
        let className = parentName.substr(parentName.indexOf(":") + 1);
        parentObject = document.getElementsByClassName(`${className}`);
      }
      else if(parentName.includes("d:")){
        let idName = parentName.substr(parentName.indexOf(":") + 1);
        parentObject = document.querySelectorAll(`#${idName}`);
      }
      else {
        parentObject = document.querySelectorAll(`${parentName}`);
      }
      let children = object[key].children;
      for(let child = 0; child < children.length; child++ ){
    
        if(children[child].includes("-c:")){
          // Get class name from array element
          let className = children[child].substr(children[child].indexOf(":") + 1);
          let getElement = children[child].replace(`-c:${className}`, "");
          // Push class to array of Classes
          this.newElements.push(getElement);
    
          if(className.includes(" ")){
            let classesArray = className.split(" ");
            [...classesArray].map(className => classes.push(className));
          }
          else {
            classes.push(className)
          }
          
          
          [...parentObject].map(parent => {
            let childElement = document.createElement(`${getElement}`);
            childElement.className = className;
            parent.appendChild(childElement)
          })
        }
        else if(children[child].includes("-d:")){
          // Get ID from array element
          let idName = children[child].substr(children[child].indexOf(":") + 1);
          let getElement = children[child].replace(`-d:${idName}`, "");
          this.newElements.push(getElement);
          // Push id to array of IDs
          ids.push(idName);
          let childElement = document.createElement(`${getElement}`);
          childElement.id = idName;
          [...parentObject].map(parent => parent.appendChild(childElement))
        }
        else {
          let element = children[child];
          this.newElements.push(element);
          [...parentObject].map(parent => {
            let childElement = document.createElement(`${element}`);
            parent.appendChild(childElement)
          })
        }
      }
    }
  }
  function checkArray(array, value){
    for(let i = 0; i < array.length; i++){
      if(array[i] == value || array[i] == value.toUpperCase()){
        return true;
      }
    }
  }
  // Assignes defined properties
  function insertProperties (arrayOfElements, objectOfProperties) {
    let keyNames = [];
    // Check if <style> tag exists
    if(!styleExists){
      let style = document.createElement("style");
      document.querySelector("head").appendChild(style);
      styleExists = true;
    }
    // Create an array of names of properties eg: class, style, src...
    for(key in objectOfProperties){
      keyNames.push(key);
    }
    // Go throught each element in the array of names of properties
    for(let j = 0; j < keyNames.length; j++) {
      let getElement;
      let isClass = false;
      let exists = true;
      let animate = false;
      // Get the current element in DOM
      if(checkArray(this.htmlTags, keyNames[j])){
        getElement = document.querySelector(`${keyNames[j]}`);
      }
      else if(checkArray(ids, keyNames[j])){
        getElement = document.querySelector(`#${keyNames[j]}`);
      }
      else if(checkArray(classes, keyNames[j])){
        getElement = document.querySelectorAll(`.${keyNames[j]}`);
        isClass = true;
      }
      // If you want to choose a perticular element by class name
      else if(keyNames[j].includes(":")){
        let index=  keyNames[j].substr(0, keyNames[j].indexOf(':'));
        let className = keyNames[j].substr(keyNames[j].indexOf(":") + 1);
        getElement = document.getElementsByClassName(`${className}`)[index-1];
      }
      else if(keyNames[j] == "animate"){
        animate = true;
      }
      else{
        isClass = true;
        exists = false;
      }
      /* Set the object of properties for each element:
        object(some element) : {
            class : "new-p",
            style : {
              background : "#320012",
              margin: "auto",
              padding:"0",
              width : "100%",
              height : "200px"
            }
        */
      let properties = objectOfProperties[keyNames[j]];
    
      // Go through each Property in object Properties (eg: class, style)
      for(property in properties) {
        let styleTag = document.querySelector("style");
        if (animate){
          // let animationArray = [];
          // let animationLines = [];
          // if(property == "name"){
          //   this.animationName = properties[property]
          // }
          // else if (property == "logic"){
          //   for(style in properties[property]){
          //     for(let i = 0; i < this.animationExtensions.length; i++){
          //       let line;
          //       for(key in properties[property][style]){
          //         line = `${style}:{${this.animationExtensions[i]}${key}:${properties[property][style][key]};}`
          //         animationArray.push(line)
          //       }
          //     }
          //   }
          //   for(let k = 0; k < animationArray.length; k++) {
          //     let fullLine = `@${this.animationExtensions[k]}keyframes ${this.animationName} {${ animationArray[k]}}`
          //     animationLines.push(fullLine)
          //   }

            
          //   // let stylingBegins = `.${ClassName}${property}{ ${getAllStyles} }`;
          //   //       styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
          //   //       this.styleName = `.${ClassName}`
          // }
        }
        else if(exists){
          let tag;
          let ClassName;
          if(isClass){
            tag = getElement[0].tagName;
            ClassName = keyNames[j];
          }
          else {
            console.log(getElement)
            console.log(getElement.tagName)
            tag = getElement.tagName;
            ClassName = getElement.classList[0];
          }
        
          // Create an array of styles that are going to be insertedin the elements style property
          let arraOfStyles = [];
          let individualProperties = properties[property];
            // Create the style object for each style property
            for(individualProperty in individualProperties){
              let styleProperty = `${individualProperty}: ${individualProperties[individualProperty]};`
              arraOfStyles.push(styleProperty);
            }
          
          // If property is called class, add class name property to element
          if(property == "class"){
            getElement.className += ` ${properties[property]}`;
          }
          // Else if property is style, add style to <style> tag
          else if (property == "style" || property.includes(":") && !property.includes("@")) {
            /* Get the individual properties of the property Style:
                background : "#320012",
                margin: "auto",
                padding:"0",
                width : "100%",
                height : "200px"
            */
            // Combine all of the properties to enable insertion into the elements style property
            let getAllStyles = arraOfStyles.join(" ");
            // Check if the element that is passed has a class
            if(isClass){
              if(getElement[0].className.length > 0){
                if(property.includes(":")){
                  let stylingBegins = `.${ClassName}${property}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `.${ClassName}`
                }
                // Check if class name hasent been styled already
                if(checkArray(styledElements, ClassName) != true){
                  let stylingBegins = `.${ClassName}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `.${ClassName}`
                }
              
                // Mark the class name as styled
                styledElements.push(ClassName);
              }
              else if (getElement.id.length > 0){
                let ID = getElement.id;
                if(property.includes(":")){
                  let stylingBegins = `#${ID}${property}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `#${ID}`
                }
                // Check if class name hasent been styled already
                if(checkArray(styledElements, ID) != true){
                  let stylingBegins = `#${ID}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `#${ID}`
                }
              
                // Mark the class name as styled
                styledElements.push(ClassName);
              }
              else if(getElement.className.length <= 0){
                if(property.includes(":")){
                  let stylingBegins = `${tag}${property}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `${tag}`
                }
                // Check if tag hasent been styled already
                if(checkArray(styledElements, tag) != true){
                  let stylingBegins = `${tag}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `${tag}`
                }
              
                // Mark the tag as styled
                styledElements.push(tag);
              }
            }
            else {
              if(getElement.className.length > 0){
                if(property.includes(":")){
                  let stylingBegins = `.${ClassName}${property}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `.${ClassName}`
                }
                // Check if class name hasent been styled already
                if(checkArray(styledElements, ClassName) != true){
                  let stylingBegins = `.${ClassName}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `.${ClassName}`
                }
              
                // Mark the class name as styled
                styledElements.push(ClassName);
              }
              else if (getElement.id.length > 0){
              
                let ID = getElement.id;
                if(property.includes(":")){
                  let stylingBegins = `#${ID}${property}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `#${ID}`
                }
                // Check if class name hasent been styled already
                if(checkArray(styledElements, ID) != true){
                  let stylingBegins = `#${ID}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `#${ID}`
                }
              
                // Mark the class name as styled
                styledElements.push(ID);
              }
              else if(getElement.className.length == 0){
                if(property.includes(":")){
                  let stylingBegins = `${tag}${property}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `${tag}`
                }
                // Check if tag hasent been styled already
                if(checkArray(styledElements, tag) != true){
                  let stylingBegins = `${tag}{ ${getAllStyles} }`;
                  styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
                  this.styleName = `${tag}`
                }
              
                // Mark the tag as styled
                styledElements.push(tag);
              }
            }
          }
          else if(property.includes("@")){
            arraOfStyles = [];
            for(individualProperty in individualProperties){
              let styleProperty = `${individualProperty}: ${individualProperties[individualProperty]};`
              arraOfStyles.push(styleProperty);
            }
            let getAllStyles = arraOfStyles.join(" ");
            this.styleName = this.styleName.split(" ")[0]
            let stylingBegins = `${property}{${this.styleName}{${getAllStyles}}}`;
            
            styleTag.insertAdjacentHTML('beforeend', stylingBegins);
          }
          // Check if property is innerHTML
          else if(property == "innerHTML"){
            // Check if property of innerHTML is a string or other type operand
            if(typeof properties[property] === "string"){
              if(isClass){
                [...getElement].map(element => element.innerHTML = `${properties[property]}`)
              }
              else{
                getElement.innerHTML = `${properties[property]}`
              }
            }
            else if(typeof properties[property] === "object"){
              let array = properties[property];
              let arrayOfChildren = [];
              let getParent;
            
              if(checkArray(this.htmlTags, keyNames[j])){
                getParent = document.querySelector(`${keyNames[j]}`);
              }
              else if(checkArray(ids, keyNames[j])){
                getParent = document.querySelector(`#${keyNames[j]}`);
              }
              else if(checkArray(classes, keyNames[j])){
                getParent = document.querySelector(`.${keyNames[j]}`);
              }
              else{
                throw `: Your element "${keyNames[j]}" could not be found`;
              }
                for(let k = 0; k < array.length; k++){
                let childElement = document.createElement(`${array[k]}`);
                arrayOfChildren.push(childElement);
              }
              for(let c = 0; c < arrayOfChildren.length; c++){
                getParent.appendChild(arrayOfChildren[c]);
              }
            }
          }
          else {
            if(isClass){
                [...getElement].map(element => element.setAttribute(`${property}`, `${properties[property]}`))
              }
            else {
              getElement.setAttribute(`${property}`, `${properties[property]}`);
            }
          }
        }
        else {
          if (property == "style" || property.includes(":") && !property.includes("@")) {
            // Create an array of styles that are going to be insertedin the elements style property
            let arraOfStyles = [];
            /* Get the individual properties of the property Style:
                background : "#320012",
                margin: "auto",
                padding:"0",
                width : "100%",
                height : "200px"
            */
            let individualProperties = properties[property];
            // Create the style object for each style property
            for(individualProperty in individualProperties){
              let styleProperty = `${individualProperty}: ${individualProperties[individualProperty]};`
              arraOfStyles.push(styleProperty);
            }
            // Combine all of the properties to enable insertion into the elements style property
            let getAllStyles = arraOfStyles.join(" ");
            if(property.includes(":")){
              let stylingBegins = `.${keyNames[j]}${property}{ ${getAllStyles} }`;
              let styleTag = document.querySelector("style");
              styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
            }
            else {
              let stylingBegins = `.${keyNames[j]}{ ${getAllStyles} }`;
              let styleTag = document.querySelector("style");
              styleTag.insertAdjacentHTML('afterbegin', stylingBegins);
            }
          }
          else {
            throw `: You can not assign "${property}", only style or ":" styling such as :hover,:after,:before can be assigned to "${keyNames[j]}", which doesnt have a DOM element assinged to it.`;
          }
        }
      }
    }
  }
}
 
 
 
 
 
 
