// class Person{
//     constructor(name,age){
//         this.name=name;
//         this.age=age;
//     }
//     getUserDescription(){
//         return `${this.name} is ${this.age} year old` 
//     }
// }
//  var me = new Person("himanshu","25");
//  var description=me.getUserDescription(me);
//  console.log(description)
 

class Users{
    constructor(){
        this.users=[];
    }
    addUser(id,name,room){
        var user={id,name,room}
        this.users.push(user);
        return user;
    }
    removeUser(id){
        var user=this.getUser(id)
        var users=this.users.filter((user)=>user.id!==id)
        this.users=users;
        return user;
    }
    getUser(id){
        var user=this.users.filter((user)=>user.id===id)
        return user[0];
    }
    getUserList(room){
        var users=this.users.filter((user)=>user.room===room)
        var namesArray = users.map((user)=>user.name)
        return namesArray;
    }
}

module.exports = {Users}