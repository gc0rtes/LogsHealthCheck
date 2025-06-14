import React from 'react'

const Dashboard = () => {
    return (
        <div className='flex flex-col gap-5 w-full'>
            <h1 className='font-bold text-4xl mx-6 text-center'>hello world</h1>
            <div className='mx-auto py-8'>
                <div className='flex flex-col gap-5 w-full'>
                    <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>

                    </section>

                    <section className='grid grid-cols-1 gap-4 transition-all lg:grid-cols-2'>

                    </section>

                </div>
            </div>
        </div>
    )
}

export default Dashboard
