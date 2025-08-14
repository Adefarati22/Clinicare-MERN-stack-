import { RiCloseLine, RiMenuLine } from '@remixicon/react'
import React, { useState } from 'react'
import Sidebar from './Sidebar';
import ErrorAlert from './ErrorAlert';
import Header from './Header';
import Logo from './Logo';

export default function Drawer({ error, loading }) {
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => setOpen(!open);
  return (
    <div className='lg:hidden bg-white rounded-lg shadow'>
    <div className='flex items-center justify-between p-4'>
    <Logo/>
    <button onClick={toggleDrawer}>
        <RiMenuLine size={24}/>
    </button>
    </div>
    <div  className={`drawer fixed top-0 left-0  z-50 ${open ? "drawer-open" :""}`}>
        <input type='checkbox' className='drawer-toggle' checked={open} onChange={toggleDrawer}/>
        <div className="drawer-side">
          <label
            className="drawer-overlay"
            onClick={() => setOpen(false)}
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-[100vw] p-4">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-4"
              type="button"
              onClick={toggleDrawer}
            >
              <RiCloseLine size={24} />
            </button>
            <Header />
            <div className="mt-4 h-[calc(100vh-150px)] overflow-y-auto">
              {error && <ErrorAlert error={error} />}
              {loading ? (
                <p className="text-center text-sm">Loading...</p>
              ) : (
                <Sidebar/>
              )}
            </div>
          </div>
        </div>
    </div>
    </div>
  )
}
