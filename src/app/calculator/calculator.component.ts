import { Component, OnInit } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
enum operator{
  Divide,
  Multiply,
  Minus,
  Plus,
}

class SubCalc
{
  constructor(){}
  Formula : string[] = [];
  InnerDimensions = 0;
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})


export class CalculatorComponent {

  constructor() { }

  input : string = "1234";
  result : string = "35";
  UseEvaluateMethod : boolean = false;

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
      if (this.UseEvaluateMethod === true)
      {
       this.result = eval(inputwithmultiplyswapped);
      }
      else
      {
        this.result = this.CustomEvaluate(inputwithmultiplyswapped);
      }
    }
  }

  AddSpecialCharacters(input : string)
  {
    if (input === "√")
    {
       this.input = "√(" + this.input + ")";
    }
    if (input === "log")
    {
       this.input = "log(" + this.input + ")";
    }
  }

  CheckForDuplicateDots(input : string) : boolean 
  {
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' ').replace(/[-]/g,' ').replace(/[+]/g,' ').split(' ');
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

  Seperatestring(input : string) : string[]
  {
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' * ').replace(/[-]/g,' - ').replace(/[+]/g,' + ').split(' ');
    this.removeValueFromArray('',numberlist);
    return numberlist;
  }

  SeperatestringThirdDimension (input : string) : string[]
  {
    let numberlist = input.replace(/[og]/g,'').replace(/[l]/g,' log ').replace(/[√]/g,' √ ').replace(/[(]/g,'').replace(/[/]/g,' / ').replace(/[*]/g,' * ').replace(/[-]/g,' - ').replace(/[+]/g,' + ')
    .replace(/[)]/g,' ) ').split(' ');
    this.removeValueFromArray('',numberlist);
    return numberlist;
  }
  
public clone(): any {
    var cloneObj = new (this.constructor() as any);
    for (var attribut in this) {
        if (typeof this[attribut] === "object") {
            cloneObj[attribut] = this[attribut];
        } else {
            cloneObj[attribut] = this[attribut];
        }
    }
    return cloneObj;
}


CustomEvaluate(input : string) : string
{
 let SeperatedList = this.SeperatestringThirdDimension(input);
 let ReturnList : any[] = [];
 let index = 0;
 let SkipFromIndex= 0;
 let SkipTOIndex = 0;
 let LogRootCount = 0;
 let InnerParenthesisCount = 0;
 let SurpressAdding = false;
 for (let DisectedFormula of SeperatedList)
 {
  if (DisectedFormula === "log" || DisectedFormula == "√")
     {
       SkipFromIndex = index;
       let closingparentheses = 0;
       let InnerLogRoot = 0;
       let OuterOperator = ""
       if (DisectedFormula === "log")
       {
         OuterOperator = "log";
       }
       if(DisectedFormula === "√")
       {
         OuterOperator = "√";
       }
          for(let i = index; i < SeperatedList.length; i++)
          {
            let CompareValue = SeperatedList[i];
            if (CompareValue === ')')
            {
              closingparentheses = closingparentheses + 1;
               if (InnerLogRoot < closingparentheses)
               {
                 let LogUnitToString = "";
                 SkipTOIndex = i;
                 for (let x = SkipFromIndex; x <= SkipTOIndex; x++)
                 {
                   if (!(SeperatedList[x] === "log" || SeperatedList[x] === ")" || SeperatedList[x] === "√"))
                   {
                      LogUnitToString = LogUnitToString.concat(SeperatedList[x])
                   }
                 }
                 let InnerAnswer = this.CalculateSubstringSecondDimension(LogUnitToString);
                 let InnerNumber = Number(InnerAnswer);
                 if (isNaN(InnerNumber))
                 {
                   return "Invalid input"
                 }
                 let LogAnswer : Number = 0;
                 if (DisectedFormula === "log")
                 {
                    LogAnswer = Math.log10(InnerNumber);
                 }
                 else
                 if (DisectedFormula === "√")
                 {
                  LogAnswer = Math.sqrt(InnerNumber);
                 }

                 ReturnList.push(LogAnswer);
               }
            }
            index = index + 1;
          }
          LogRootCount = LogRootCount + 1;
          SurpressAdding = true;
     }
     
       else if (SurpressAdding === false)
       {
        ReturnList.push(DisectedFormula);
       }
       if (DisectedFormula === ")")
       {
         InnerParenthesisCount = InnerParenthesisCount + 1;
         if(LogRootCount === InnerParenthesisCount)
         {
           SurpressAdding = false;
         }
       }
     
     index + index + 1;
 }
 let ConcatenadedString =  ReturnList.join().replace(/[,]/g,'');
 let answer = this.CalculateSubstringSecondDimension(ConcatenadedString);
 return answer;
}

CalculateSubstringSecondDimension(input : string) : string
{
  let SeperatedArray = this.Seperatestring(input) as string[];
  let index = 0;
  let ClonedArray = Object.assign([],SeperatedArray);
  let MultiplyDivideOccurances = 0;
  let MinusPlustOccurances = 0;
  for (let ValuesAndOperators of SeperatedArray)
  {
    if (ValuesAndOperators === "*")
    {
      try 
      {
       let previousnumber = Number(ClonedArray[(index - 1) - (MultiplyDivideOccurances * 2)]);
       let nextnumber = Number(SeperatedArray[index + 1]);
       if (isNaN(previousnumber) || isNaN(nextnumber))
       {
         return "Invalid input"
       }
       else
       {
         let CalculatedValue = previousnumber * nextnumber;
         ClonedArray.splice((index + 1) - ((MultiplyDivideOccurances * 2)),1);
         ClonedArray.splice(index - ((MultiplyDivideOccurances * 2)),1);
         ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),1);
         ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),0,CalculatedValue.toString());
         MultiplyDivideOccurances = MultiplyDivideOccurances + 1;
       }
      }
      catch(Error)
      {
        return "Invalid input";
      }
    }
    if (ValuesAndOperators === "/")
    {
      try 
      {
       let previousnumber = Number(ClonedArray[(index - 1) - (MultiplyDivideOccurances * 2)]);
       let nextnumber = Number(SeperatedArray[index + 1]);
       if (isNaN(previousnumber) || isNaN(nextnumber))
       {
         return "Invalid input"
       }
       else
       {
         let CalculatedValue = previousnumber / nextnumber;
         ClonedArray.splice((index + 1) - ((MultiplyDivideOccurances * 2)),1);
         ClonedArray.splice(index - ((MultiplyDivideOccurances * 2)),1);
         ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),1);
         ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),0,CalculatedValue.toString());
         MultiplyDivideOccurances = MultiplyDivideOccurances + 1;
       }
      }
      catch(Error)
      {
        return "Invalid input";
      }
    }
    if (ValuesAndOperators === "+")
    {
      try 
      {
       let previousnumber = Number(ClonedArray[(index - 1) - (MultiplyDivideOccurances * 2)]);
       let nextnumber = Number(SeperatedArray[index + 1]);
       if (isNaN(previousnumber) || isNaN(nextnumber))
       {
         return "Invalid input"
       }
       else
       {
        if (!!ClonedArray[(index + MinusPlustOccurances + 1) - (MultiplyDivideOccurances) - (MinusPlustOccurances)])
        {
        if (ClonedArray[(index + MinusPlustOccurances + 1) - (MultiplyDivideOccurances) - MinusPlustOccurances] === "*" ||ClonedArray[(index + 2) - (MultiplyDivideOccurances) - MinusPlustOccurances] === "/")
        {
          MinusPlustOccurances = MinusPlustOccurances + 1
        }
        else
        {
          let CalculatedValue = previousnumber + nextnumber;
          ClonedArray.splice((index + 1) - ((MultiplyDivideOccurances *2)),1);
          ClonedArray.splice(index - ((MultiplyDivideOccurances * 2)),1);
          ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),1);
          ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),0,CalculatedValue.toString());
          MultiplyDivideOccurances = MultiplyDivideOccurances + 1;
          MinusPlustOccurances = MinusPlustOccurances + 1
        }
        }
        else
        {   
          let CalculatedValue = previousnumber + nextnumber;
          ClonedArray.splice((index + 1) - ((MultiplyDivideOccurances * 2)),1);
          ClonedArray.splice(index - ((MultiplyDivideOccurances * 2) ),1);
          ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),1);
          ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),0,CalculatedValue.toString());  
          MinusPlustOccurances = MinusPlustOccurances + 1
        }
       }
      }
      catch(Error)
      {
        return "Invalid input";
      }
    }
    if (ValuesAndOperators === "-")
    {
      try 
      {
       let previousnumber = Number(ClonedArray[(index - 1) - (MultiplyDivideOccurances * 2)]);
       let nextnumber = Number(SeperatedArray[index + 1]);
       if (isNaN(previousnumber) || isNaN(nextnumber))
       {
         return "Invalid input"
       }
       else
       {
        if (!!ClonedArray[(index + MinusPlustOccurances + 1) - (MultiplyDivideOccurances) - (MinusPlustOccurances)])
        {
        if (ClonedArray[(index + MinusPlustOccurances + 1) - (MultiplyDivideOccurances) - MinusPlustOccurances] === "*" ||ClonedArray[(index + 2) - (MultiplyDivideOccurances) - MinusPlustOccurances] === "/")
        {
          MinusPlustOccurances = MinusPlustOccurances + 1
        }
        else
        {
          let CalculatedValue = previousnumber - nextnumber;
          ClonedArray.splice((index + 1) - ((MultiplyDivideOccurances *2)),1);
          ClonedArray.splice(index - ((MultiplyDivideOccurances * 2)),1);
          ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),1);
          ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),0,CalculatedValue.toString());
          MultiplyDivideOccurances = MultiplyDivideOccurances + 1;
          MinusPlustOccurances = MinusPlustOccurances + 1
        }
        }
        else
        {   
          let CalculatedValue = previousnumber - nextnumber;
          ClonedArray.splice((index + 1) - ((MultiplyDivideOccurances * 2)),1);
          ClonedArray.splice(index - ((MultiplyDivideOccurances * 2) ),1);
          ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),1);
          ClonedArray.splice((index - 1) - ((MultiplyDivideOccurances * 2)),0,CalculatedValue.toString());  
          MinusPlustOccurances = MinusPlustOccurances + 1
        }
       }
      }
      catch(Error)
      {
        return "Invalid input";
      }
    }
    index = index + 1;
  }
  let cleanedupanswer = ClonedArray.join().replace(/[,]/g,'');
  let CalculatedAnswer = this.CalculateSubString(cleanedupanswer);
  return CalculatedAnswer;
}

  CalculateSubString(input : string) : string
  {
     var SeperatedArray = this.Seperatestring(input) as string[];
     let ReturnAnswer = 0 ;
     let index = 0;
     if (SeperatedArray.length === 1)
     {
      let ConvertedNumber = Number(SeperatedArray[0]);
      if (isNaN(ConvertedNumber))
      {
        return "Invalid input"
      }
      else
      {
       ReturnAnswer = ConvertedNumber;
      }
     }
     for (let ValuesAndOperators of SeperatedArray)
     {
        if (ValuesAndOperators === "/")
        {
          try
          {
           let previousnumber = Number(SeperatedArray[index - 1]);
           let nextnumber = Number(SeperatedArray[index + 1]);
           if (isNaN(previousnumber) || isNaN(nextnumber))
           {
             return "Invalid input"
           }
           else
           {
             var subanswer = 0;
             if (index === 1)
            {
             var subanswer = previousnumber / nextnumber;
            }
            else
            {
              var subanswer = ReturnAnswer / nextnumber;
            }
            ReturnAnswer = subanswer;
           }
          }
          catch(Error)
          {
            return "Invalid input";
          }
        } 
        if (ValuesAndOperators === "*")
        {
          try
          {
           let previousnumber = Number(SeperatedArray[index - 1]);
           let nextnumber = Number(SeperatedArray[index + 1]);
           if (isNaN(previousnumber) || isNaN(nextnumber))
           {
             return "Invalid input"
           }
           else
           {
             var subanswer = 0;
             if (index === 1)
            {
             var subanswer = previousnumber * nextnumber;
            }
            else
            {
              var subanswer = ReturnAnswer * nextnumber;
            }
            ReturnAnswer = subanswer;
           }
          }
          catch(Error)
          {
            return "Invalid input";
          }
        }
         if (ValuesAndOperators === "-")
        {
          try
          {
           let previousnumber = Number(SeperatedArray[index - 1]);
           let nextnumber = Number(SeperatedArray[index + 1]);
           if (isNaN(previousnumber) || isNaN(nextnumber))
           {
             return "Invalid input"
           }
           else
           {
             var subanswer = 0;
             if (index === 1)
            {
             var subanswer = previousnumber - nextnumber;
            }
            else
            {
              var subanswer = ReturnAnswer - nextnumber;
            }
            ReturnAnswer = subanswer;
           }
          }
          catch(Error)
          {
            return "Invalid input";
          }
        }
        if (ValuesAndOperators === "+")
        {
          try
          {
           let previousnumber = Number(SeperatedArray[index - 1]);
           let nextnumber = Number(SeperatedArray[index + 1]);
           if (isNaN(previousnumber) || isNaN(nextnumber))
           {
             return "Invalid input"
           }
           else
           {
             var subanswer = 0;
             if (index === 1)
            {
             var subanswer = previousnumber + nextnumber;
            }
            else
            {
              var subanswer = ReturnAnswer + nextnumber;
            }
            ReturnAnswer = subanswer;
           }
          }
          catch(Error)
          {
            return "Invalid input";
          }
        } 
        index = index + 1;
     }
     return ReturnAnswer.toString();
  }

  CheckForDivisionByZero(input : string) : boolean
  {
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' ').replace(/[-]/g,' ').replace(/[+]/g,' ').split(' ');
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
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' ').replace(/[-]/g,' ').replace(/[+]/g,' ').split(' ');
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
    let numberlist = input.replace(/[/]/g,' / ').replace(/[*]/g,' ').replace(/[-]/g,' ').replace(/[+]/g,' ').split(' ');
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

