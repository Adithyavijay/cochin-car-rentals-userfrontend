import React from 'react'

export default function Sidebar() {
  return (
    <div className='w-1/5 h-full bg-yellow-100 pt-24 px-10 text-black'>
        <div className='flex  justify-between'>
            <div>
                fliter by 
            </div>
            <div>
                reset all
            </div>

        </div>

            <input type="text"
            placeholder='search'
            />  

            <div className=''>
                rental type 
            </div>

            <div>
                price range per dayy 
                    {/* here there should be a sliding component for choosing the price from max to min . it works like the cars will be shown based on this pricing */}
            </div>  

            <div>
                car brand 

            </div> 
            <div>
                car model 
            </div>
            
            <div>
                year of manufacture
            </div> 

            <div>
               <h1>body type</h1> 
               <div className='grid grid-cols-2'>
                    <div className='flex gap-x-2'>
                        <input type="checkbox" />
                        <span>sedan</span>
                    </div>
                    <div className='flex gap-x-2'>
                        <input type="checkbox" />
                        <span>Wagon</span>
                    </div>
                    <div className='flex gap-x-2'>
                        <input type="checkbox" />
                        <span>Couple</span>
                    </div>
                    <div className='flex gap-x-2'>
                        <input type="checkbox" />
                        <span>Van</span>
                    </div>
               </div>
             
            </div> 
            <div> 
                
                
                <h1>transmission </h1>   
                <div className=' flex flex-col'>
                        <div className='flex'>
                            <input type="checkbox" />
                            <span>Any</span>
                        </div>
                        <div className='flex'>
                            <input type="checkbox" />
                            <span>Manual</span>
                        </div>
                        <div className='flex'>
                            <input type="checkbox" />
                            <span>Automatic</span>
                        </div>
                      
                    </div>
            
            </div>
            <h1>Fuel type</h1> 
            <div className='flex gap-x-5'>
               
                <div className='flex'>
                <input type="checkbox" />
                <span>Diesel</span>

                </div>
                <div className='flex'>
                <input type="checkbox" />
                <span>Diesel</span>

                </div>
               
            </div>
        
        </div>


   
  )
}
