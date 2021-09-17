import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  constructor() { }

  input : string = "1234";
  result : string = "35";

  ngOnInit(): void {
  }

  InputValue(inputvariable: string)
  {
    this.input = this.input + inputvariable;
  }

  Clear()
  {
    this.input = "";
    this.result = "";
  }

  CalculateAnswer()
  {
    let inputwithmultiplyswapped = this.input.replace(/x/g,"*")
    if (this.CheckForDuplicateDots(inputwithmultiplyswapped))
    {
      this.result = "Duplicate dots!"
    }
    else
    if(this.CheckForValueStartingWithZero(inputwithmultiplyswapped))
    {
      this.result = "False zero!"
    }
    else
    if (this.CheckForDivisionByZero(inputwithmultiplyswapped))
    {
      this.result = "Division by zero!"
    }
    else
    if (this.CheckForMultipleFollowingOperators(inputwithmultiplyswapped))
    {
      this.result = "Multiple operators!"
    }
    else
    {
    this.result = eval(inputwithmultiplyswapped);
    }
  }

  CheckForDuplicateDots(input : string) : boolean 
  {
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' ').replace(/[-]/,' ').replace(/[+]/,' ').split(' ');
    this.removeValueFromArray('',numberlist);
    for (let item of numberlist)
    {
      if (item.replace(/[^.]/g,"").length > 1)
      {
        return true;
      }
    }
    return false;
  }

  CheckForDivisionByZero(input : string) : boolean
  {
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' ').replace(/[-]/,' ').replace(/[+]/,' ').split(' ');
    this.removeValueFromArray('',numberlist);
    let index = 0;
    for (let item of numberlist)
    {
      if (item === "/")
      {
         let parsedvalue = Number(numberlist[index + 1])
         if (!isNaN(parsedvalue))
         {
         if (parsedvalue === 0)
         {
           return true;
         }
        }

      }
      index = index + 1;
    }
    return false;
  }

  removeValueFromArray(Value: any,Array : any ){
    Array.forEach( (item : any, index : any) => {
    if(item === Value) Array.splice(index,1);
  });
}


  CheckForValueStartingWithZero(input : string) : boolean
  {
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' ').replace(/[-]/,' ').replace(/[+]/,' ').split(' ');
    this.removeValueFromArray('',numberlist);
    for (let item of numberlist)
    {
    var Regex = /^0[0-9].*$/
    if (Regex.test(item))
    {
      return true
    }
   }
   return false;
  }
  CheckForMultipleFollowingOperators(input : string) : boolean
  {
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' ').replace(/[-]/,' ').replace(/[+]/,' ').split(' ');
    this.removeValueFromArray('',numberlist);
    let index = 0;
    for (let item of numberlist)
    {
    if (item === "/" || item === "*" || item === "-" || item === "+")
    {
     let followingoperator = numberlist[index + 1]
     if (followingoperator === "/" || followingoperator === "*" || followingoperator === "-" || followingoperator === "+")
     {
       return true;
     }
    }
    index = index + 1;
   }
   return false;
  }
}

