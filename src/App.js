import './App.css'
import money from './img/money.png'
import CurrencyComponent from './component/CurrencyComponent'
import {useEffect, useState} from "react"

function App() {
  
  const [currencyChoice, setCurrencyChoice] = useState([]) // เก็บรหัสสกุลเงินจาก API
  const [fromCurrency, setFromCurrency] = useState("THB") // สกุลเงินต้นทาง
  const [toCurrency, setToCurrency] = useState("USD") // สกุลเงินปลายทาง
  const [amount, setAmount] = useState(0) // จำนวนเงิน
  const [exChangerate, setExchangerate] = useState(0) // อัตราแลกเปลี่ยน
  const [checkFromCurrency, setCheckFromCurrency] = useState(true) // สถานะการแปลงเงิน
  let fromAmount,toAmount

  if(checkFromCurrency){
    fromAmount = amount
    toAmount = (amount*exChangerate).toFixed(2)
  }else{
    toAmount = amount
    fromAmount = (amount/exChangerate).toFixed(2)
  }

  // 1. เมื่อ Component ถูกโหลด (mount)
  // 2. หรือเมื่อมีการเปลี่ยนแปลงใน dependencies (ไม่มี dependencies ในที่นี้)
  // 3. ทำการ fetch ข้อมูลจาก API
  // 4. และแปลงไฟล์เป็น json

  // คำสั่งดึงเอาเฉพาะรหัสสกุลเงินจาก API มาใช้งาน
  // 1.data.rates: จากข้อมูลที่ได้จาก API (ที่ถูกแปลงเป็น JSON) นั้นมี property ชื่อ rates ซึ่งเป็นอ็อบเจ็กต์ที่มีค่าเป็นอัตราแลกเปลี่ยนของสกุลเงินต่าง ๆ.
  // 2.Object.keys(data.rates): ใช้ Object.keys() เพื่อดึง key ทั้งหมดของ data.rates, ซึ่งในที่นี้คือรหัสของสกุลเงิน (currency code) เช่น 'USD', 'EUR', 'THB', ฯลฯ.
  // 3.[...Object.keys(data.rates)]: ใช้ spread operator (...) เพื่อสร้าง array ของรหัสสกุลเงินจาก key ที่ได้จาก data.rates.
  // 4.setCurrencyChoice([...Object.keys(data.rates)]): ใช้ setCurrencyChoice เพื่ออัปเดต state currencyChoice ใน React ด้วย array ของรหัสสกุลเงินทั้งหมดที่ได้จาก API.
  // ดังนั้น, ในส่วนนี้โค้ดกำลังทำหน้าที่เก็บรหัสสกุลเงินทั้งหมดที่ได้มาจาก API ลงใน state currencyChoice ของ Component.
  useEffect(() => {
      const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      fetch(url)
      .then(res=>res.json())
      .then(data=>{
      setCurrencyChoice([...Object.keys(data.rates)])
      setExchangerate(data.rates[toCurrency])
     })
  },[fromCurrency,toCurrency])

  const amountFromCurrency =(e)=>{
      setAmount(e.target.value)
      setCheckFromCurrency(true)
    }
    
    const amountToCurrency =(e)=>{
      setAmount(e.target.value)
      setCheckFromCurrency(false)
  }

  return (
    <div>
        <img src={money} alt="logo" className="money-img"/>
      <h1>แอปแปลงสกุลเงิน (API)</h1>
      <div className="container">

        {/* สกุลเงินต้นทาง ก่อนแลก*/}
        {/* ส่ง props ไปทำงานใน CurrencyComponent*/}
        <CurrencyComponent currencyChoice={currencyChoice} 
          selectCurrency={fromCurrency}
          changeCurrency={(change)=>setFromCurrency(change.target.value)}
          amount = {fromAmount}
          onChangeAmount = {amountFromCurrency}
          />

        <div className="equal"> = </div>

        {/* สกุลเงินปลายทาง หลังแลก */}
        <CurrencyComponent currencyChoice={currencyChoice} 
          selectCurrency={toCurrency}
          changeCurrency={(change)=>setToCurrency(change.target.value)}
          amount = {toAmount}
          onChangeAmount = {amountToCurrency}
        />

      </div>
    </div>
  );
}

export default App