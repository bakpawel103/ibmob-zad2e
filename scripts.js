let db;

window.onload = () => {
	//Open Database
	var request = indexedDB.open('userData', 1);
	
	request.onupgradeneeded = function(e){
		db = e.target.result;
		
		if(!db.objectStoreNames.contains('users')){
      var objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      
      objectStore.createIndex('name', 'name', { unique: false });
		}
	}
	
	request.onsuccess = function(e){
		console.log('Success: Opened Database...');
    db = e.target.result;
    loadData();
	} 
	
	request.onerror = function(e){
		console.log('Error: Could Not Open Database...');
	}
};

function loadData() {
  var transaction = db.transaction(["users"], "readonly");
	//Ask for ObjectStore
	var store = transaction.objectStore("users");
	var index = store.index('name');
	
	var output = '';
	index.openCursor().onsuccess = function(e) {
    var cursor = e.target.result;

		if(cursor){
			output += "<tr id='user" + cursor.value.id + "'>";
			output += "<td><span class='cursor user' contenteditable='true' data-field='name' data-id='" + cursor.value.id + "'>" + cursor.value.name + "</span></td>";
			output += "<td><span class='cursor user' contenteditable='true' data-field='email' data-id='" + cursor.value.id + "'>" + cursor.value.email + "</span></td>";
			output += "<td><span class='cursor user' contenteditable='true' data-field='postalCode' data-id='" + cursor.value.id + "'>" + cursor.value.postalCode + "</span></td>";
			output += "<td><span class='cursor user' contenteditable='true' data-field='nip' data-id='" + cursor.value.id + "'>" + cursor.value.nip + "</span></td>";
			output += "<td><span class='cursor user' contenteditable='true' data-field='idNumber' data-id='" + cursor.value.id +"'>" + cursor.value.idNumber + "</span></td>";
			output += "<td><span class='cursor user' contenteditable='true' data-field='phone' data-id='" + cursor.value.id + "'>" + cursor.value.phone + "</span></td>";
			output += "<td><a onclick='removeUser(" + cursor.value.id + ")' href=''>Delete</a></td>";
			output += "</tr>";
			cursor.continue();
    }
    
		$('#users').html(output);
	}
}

function addUser() {
  var newUser = getUserData();

  var transaction = db.transaction(["users"], "readwrite");
	//Ask for ObjectStore
	var store = transaction.objectStore("users");
	
	//Perform the Add
	var request = store.add(newUser);
	
	//Success
  request.onsuccess = function (e) {
    console.log("Added user...");
	}
	
	//Error
	request.onerror = function(e){
		alert("Sorry, the user was not added");
		console.log('Error', e.target.error.name);
	}
}

//update user
$('#users').on('blur', '.user', function(){
	var newText = $(this).html();
	var field = $(this).data('field');
	var id = $(this).data('id');
	
	var transaction = db.transaction(["users"], "readwrite");
	var store = transaction.objectStore("users");
	
	var request = store.get(id);
	
	request.onsuccess = function(){
		var data = request.result;
		if(field == 'name'){
			data.name = newText;
		}else if(field == 'email'){
			data.email = newText;
		} else if(field == 'postalCode'){
			data.postalCode = newText;
		}else if(field == 'nip'){
			data.nip = newText;
		}else if(field == 'idNumber'){
			data.idNumber = newText;
		}else if(field == 'phone'){
			data.phone = newText;
		}
		
		var requestUpdate = store.put(data);
		
		requestUpdate.onsuccess = function(){
			console.log('User field updated...');
		}
		
		requestUpdate.onerror = function(){
			console.log('Error: User field NOT updated...');
		}
	}
});

function removeUser(id){
	var transaction = db.transaction(["users"], "readwrite");
	var store = transaction.objectStore("users");
	
	var request = store.delete(id);
	
	request.onsuccess = function(){
		console.log('user ' + id + ' deleted');
		$('.user_'+id).remove();
	}
	
	request.onerror = function(e){
		alert("Sorry, the user was not removed");
		console.log('Error', e.target.error.name);
	}
}

function getUserData() {
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var postalCode = document.getElementById('postalCode').value;
  var nip = document.getElementById('nip').value;
  var idNumber = document.getElementById('idNumber').value;
  var phone = document.getElementById('phone').value;

  return {
    name: name,
    email: email,
    postalCode: postalCode,
    nip: nip,
    idNumber: idNumber,
    phone: phone
  }
}