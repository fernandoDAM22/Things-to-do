// This is the database
const IDBRequest =  indexedDB.open("IDBTask",1);
// This is the button for create the task
const taskBtn = document.querySelector("#task-btn");
// This is the task container
const container = document.querySelector("#task-container");
// This is the dark mode button
const btnDarkMode = document.querySelector("#dark-mode");
// the completion buttons will be saved here
let btns;
// The remove button will be salved here
let removeButton;
// dark mode control
let dark = false;
/*--------------------------------------------------------- */
/*----------------Indexed DataBase--------------------------*/
/*--------------------------------------------------------- */
/** This is the event listener to create the database if is necessary*/
IDBRequest.addEventListener("upgradeneeded",()=>{
    const db = IDBRequest.result;
    db.createObjectStore("task",{
        autoIncrement: true
    });
})
/** Event listener for when everything goes well*/
IDBRequest.addEventListener("success",()=>{
    console.log("everything went correctly");
})
/**Event listener for when an error has ocurred */
IDBRequest.addEventListener("error",()=>{
    console.log("an error occurred");
})
/* This function allows us read the object in the database */
const readObjects = async () =>{
    const database = await IDBRequest.result;
    const IDBtransaction =  await database.transaction("task","readonly");
    const objectStore =  await IDBtransaction.objectStore("task");
    const cursor =  await objectStore.openCursor();
    const fragment = document.createDocumentFragment();
    container.innerHTML = ""; //reset the container
    cursor.addEventListener("success",()=>{
        if(cursor.result){
            console.log(cursor.result.complete)
            taskHTML(cursor.result.value.title,cursor.result.value.color,cursor.result.key);
            cursor.result.continue();
        }else {
            container.appendChild(fragment);
            charge();
        }
    });
}
/**
 * 
 * @param {Object} object is the object what are we going to add 
 */
const addObject = object =>{
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction("task","readwrite");
    const objectStore = IDBtransaction.objectStore("task");
    objectStore.add(object);
}
/**
 * 
 * @param {Integer} key is the key of the element that we are going to delete 
 */
const deleteObject = key =>{
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction("task","readwrite");
    const objectStore = IDBtransaction.objectStore("task");
    objectStore.delete(key);
}
/**
 * 
 * @param {Integer} key Is the key of the element that we are going to update
 * @param {Object} object is the new value for the element
 */
const updateObject = (key,object) =>{
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction("task","readwrite");
    const objectStore = IDBtransaction.objectStore("task");
    objectStore.put(object,key);
}
/*----------------------------------------------------- */
/*---------------Event listener-------------------------*/
/*----------------------------------------------------- */
/**Event listener for the add button */
taskBtn.addEventListener("click",async()=>{
    let taskContent = document.querySelector("#task-title").value;
    let taskColor = document.querySelector("#task-color").value;
    if(taskContent.length > 0){
        addObject({title: taskContent, color: taskColor},"ok");
        await readObjects();
    }else{
        await readObjects();
    }
});
/**
 * this function allows us add the event listener to each of the remove button
 */
const removeTask = () =>{
    removeButtons.forEach(element =>{
        element.addEventListener("click",async e=>{
            if( window.confirm("are you sure?")){
                deleteObject(parseInt(e.target.parentNode.id));
                 await readObjects();
            }
        });
    })
}
/**
 * This function allows us add the event listener to each of the check button
 */
const checkTask = () =>{
    btns.forEach(element =>{
        element.addEventListener("click",e=>{
            let el = element.parentNode.lastChild;
            if(element.checked){
                el.style.visibility = "visible";
                element.parentNode.style.opacity = ".5";
            }else{
                el.style.visibility = "hidden";
                element.parentNode.style.opacity = "1";
            }
        })
    })
}
/**This is the event listener for the dark mode button */
btnDarkMode.addEventListener("click",()=>{
    if(dark==false){
        darkMode();
        dark = true;
        darkModeCookie("darkMode=true");
    }else{
        lightMode();
        dark = false;
        darkModeCookie("darkMode=false");
    }
});
// This is the event listener for when the page loads
window.addEventListener("load",()=>{ 
    readObjects();
    initialMode();
});
// This is the event listener for when the DOM loads
if (document.addEventListener) {
    document.addEventListener( "DOMContentLoaded" ,async()=>{
        await readObjects();
        await initialMode();
    },false );
}
/*-----------------------------------------------------------*/
/*-------------------Functions------------------------------*/
/*-----------------------------------------------------------*/
/**
 * 
 * @param {String} content is the task content
 * @param {String} color is the task color
 * @param {Integer} id is the task container id
 */
const taskHTML = (content,color,id) =>{
    let task = document.createElement("DIV");
    let btnCheck = document.createElement('INPUT');
    let taskText = document.createElement("P");
    let removeButton = document.createElement("BUTTON");
    
    btnCheck.type = "checkBox";

    taskText.innerHTML = content;
    taskText.setAttribute("contentEditable","true");
    task.setAttribute("spellcheck","false");
    removeButton.innerHTML = "Remove";
    task.style.backgroundColor = color;
    
    task.classList.add("task");
    task.id = id;
    btnCheck.classList.add("complete");
    removeButton.classList.add("btn-remove");

    task.addEventListener("keyup",saveChanges);
    task.appendChild(btnCheck);
    task.appendChild(taskText);
    task.appendChild(removeButton);

    container.appendChild(task);
}
/**
 * 
 * @param {event} e is the event
 * This function allows us modify a task
 */
const saveChanges = e =>{
    console.log(e.keyCode);
    if(e.keyCode == 13){
        if(window.confirm("are you sure?")){
            updateObject(parseInt(e.target.parentNode.id),{title: e.target.textContent, color: e.target.parentNode.style.backgroundColor});
            readObjects();
        }else{
            readObjects();
        }
    }
}
/**
 * This funcion allows us read the remove and the check buttons
 */
const charge = () =>{
    btns = document.querySelectorAll(".complete");
    removeButtons = document.querySelectorAll(".btn-remove");
    checkTask();
    removeTask();
}
/**This funcion allows us change the page to dark mode */
const darkMode = () =>{
    btnDarkMode.innerHTML = "<p><i class='fa-solid fa-sun'></i></p>";
    document.body.style.backgroundColor = '#2f3640';
}
/**This funcion allows us change the page to light mode */
const lightMode = () =>{
    btnDarkMode.innerHTML = "<p><i class='fa-solid fa-moon'></i></p>"
    document.body.style.backgroundColor = '#FFF';
}
/**
 *  
 * @param {String} name is the cookie name
 * This function allows us add a cookie if the user accepts then
 */
const darkModeCookie = name =>{
    if(getCookie("acceptedCookies") === "true"){
        makeCookie(name,30);
    }
}
/**This function allows us set the initial mode*/
const initialMode = () =>{
    if(getCookie("darkMode") === "true") darkMode();
}




