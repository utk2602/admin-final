"use client"
import { useState, useEffect } from "react"
import { fetchDomainData } from "../services/api";

export default function Domains(){
    const [domainData,setDomainData]=useState([]);
    const [lastIndex,setLastIndex]=useState("start");

    useEffect(()=>{
        const fetchData = async()=>{
            const response = await fetchDomainData("AI/ML",1,"unmarked",lastIndex);
            setDomainData(response.content.items);
            

        }
        fetchData();
    },[lastIndex])
    
    const handleNextPage = () => {
        if (domainData.length > 0) {
            const nextIndex = domainData[domainData.length - 1]?.email;
            if (nextIndex) {
                setLastIndex(nextIndex);
            }
        }
    };

    useEffect(() => {
        console.log("Updated lastIndex:", lastIndex);
    }, [lastIndex]); 

    return(
        <div>
            <p>hi</p>
            <button onClick={handleNextPage}>Next Page</button>
        </div>
    )
}