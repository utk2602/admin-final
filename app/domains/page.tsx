"use client"
import { useState, useEffect } from "react"
import { fetchDomainData } from "../services/api";

export default function Domains(){
    const [domainData,setDomainData]=useState([]);
    const [lastIndex,setLastIndex]=useState(null);

    useEffect(()=>{
        const fetchData = async()=>{
            const response = await fetchDomainData("WEB","1","unmarked",lastIndex);
            console.log(response);
        }
        fetchData();
    },[lastIndex])
    
    return(
        <div>
            <p>hi</p>
        </div>
    )
}