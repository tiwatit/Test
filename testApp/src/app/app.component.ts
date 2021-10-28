import { Component } from '@angular/core';
import {FormBuilder,FormGroup,FormArray,Validators, AbstractControl, ValidationErrors, AsyncValidatorFn} from '@angular/forms'
import { from, NEVER, Observable, of, Subject, timer } from 'rxjs';
import { map,debounceTime, take, debounce, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testApp';
  myForm: FormGroup; 
  frameworks: Array<String> = ["Angular","React","Vue"];
  versions: Array<Array<String>>=[['1.1.1','1.2.1','1.3.3'],['2.1.2','3.2.4','4.3.1'],['3.3.1','5.2.1','5.1.3']]
  pointer: number = 0;
  show:boolean = false;



constructor(private fb: FormBuilder, private http:HttpClient) {
  this.myForm = this.fb.group({
    email: ['',[
      Validators.required,
      Validators.email,
      
    ],validate(this.http)],
    firstName:['',[
      Validators.required
    ]],
    lastName:['',[
      Validators.required
    ]],
    dateOfBirth: ['',[
      Validators.required
    ]],
    framework:['',[
      Validators.required
    ]],
    frameworkVersion:['',[
      Validators.required
    ]],
    hobbies: this.fb.array([],[Validators.required])
  })
}

ngOnInit() {
  this.myForm.valueChanges.subscribe(x=>{
    this.myForm.value.framework ? this.show=true : NEVER
    if (this.myForm.value.framework === "Angular"){
      this.pointer = 0;
    }
    else if(this.myForm.value.framework === "React")
    {
      this.pointer = 1;
    }
    else this.pointer = 2;
    if(this.email?.valid){
      console.log(1);
    }
  });
}

get email() {
  return this.myForm.get('email')
}

get hobbieForms() {
  return this.myForm.get('hobbies') as FormArray
}

addHobbie() {

  const hobbie = this.fb.group({ 
    name: [],
    duration: []
  })

  this.hobbieForms.push(hobbie);
}

deleteHobbie(i:number) {

  this.hobbieForms.removeAt(i)
}

onSubmit(){
  if(this.myForm.value.hobbies.length>0)
  if(this.myForm.valid){
    this.show=false;
  this.myForm.reset();
  }
}
}

const validate=(http:HttpClient)=>(c:AbstractControl)=>{ 
  return timer(2000).pipe(switchMap(x=>http.get<any[]>('http://localhost:3000/emails?title='+c.value).pipe(
    debounceTime(2000),
    map(arr=>arr.length ? {exists:true}: null )
  )))
}


