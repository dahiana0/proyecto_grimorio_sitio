import React from 'react'
import Lottie from "lottie-react";
import dataSofia from '../assets/dataSofia.json'

export const LootieSofia = () => {
  return (
    <div>
        <Lottie
        dataSofia={dataSofia}
        loop={true}
        style={{width: 500, height: 500 }}
        />
    </div>
  )
}
