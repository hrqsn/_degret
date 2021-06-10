import Head from 'next/head'
import Degret from '@/lib/degret'
import { useState, useEffect } from 'react'

let degret

export default function Home () {
  const initialState = {
    canvas: null,
    context: null,
    gridSize: 41,
    degree: 20,
    distance: 40,
    centerChecked: false,
    nonOverrideChecked: false
  }

  const [state, setState] = useState(initialState)

  useEffect(() => {
    const _canvas = document.getElementById('canvas')
    const _context = _canvas.getContext('2d')
    setState({ ...state, canvas: _canvas, context: _context })
    degret = new Degret({ ...state, canvas: _canvas, context: _context })
  }, [])

  const submit = () => {
    degret.update(state)
  }

  const reset = () => {
    setState(initialState)
    degret.update(initialState)
    document.getElementById('degree').value = 20
    document.getElementById('distance').value = 40
  }

  const download = () => {
    degret.download()
  }

  return (
    <>
      <Head>
        <title>Degret | Minecraft建築補助ツール</title>
        <meta name='description' content='DegretはMinecraftの斜め建築をより正確に、楽にこなすためのツールです。' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link rel='icon' href='https://degret.jp/icons/favicon.ico' />
        <meta name='theme-color' content='#ffffff' />
        <link rel='apple-touch-icon' href='https://degret.jp/icons/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='https://degret.jp/icons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='https://degret.jp/icons/favicon-16x16.png' />
        <link rel='icon' type='image/png' href='https://degret.jp/icons/android-chrome-256x256.png' sizes='256x256' />
        <link rel='manifest' href='https://degret.jp/icons/site.webmanifest' />
      </Head>

      <main>
        <header className='bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex-shrink-0 flex items-center'>
                <img src='/degret.svg' alt='degret' />
              </div>
              <div className='flex items-center'>
                <a href='https://twitter.com/hrqsn' target='_blank' rel='noopener noreferrer' className='hover:underline'>開発者</a>
              </div>
            </div>
          </div>
        </header>
        <section className='max-w-7xl mx-auto px-4 sm:px-8 my-6'>
          <div className='relative grid grid-cols-3 gap-8'>
            <div className='col-span-3 sm:col-span-2'>
              <canvas id='canvas' className='w-full border border-gray-200 rounded-lg' />
            </div>
            <div className='col-span-3 sm:col-span-1'>
              <div className='mt-2 flex justify-between items-center'>
                <h1 className='text-xl font-bold'>設定</h1>
                <button className='text-sm hover:underline focus:outline-none' onClick={() => reset()}>リセット</button>
              </div>
              <div className='mt-8'>
                <div className='mt-4'>
                  <label htmlFor='gridValue' className='block text-sm font-medium text-gray-700'>グリッドの大きさ</label>
                  <div className='mt-1 flex items-center'>
                    <input type='range' id='gridValue' name='gridValue' min='41' max='150' step='1' value={state.gridSize} onChange={(e) => setState({ ...state, gridSize: Number(e.target.value) })} className='appearance-none w-full h-1 bg-gray-400 rounded outline-none slider-thumb' />
                    <label htmlFor='gridValue' className='font-mono ml-4'>{state.gridSize}</label>
                  </div>
                </div>
                <div className='mt-4'>
                  <label htmlFor='degree' className='block text-sm font-medium text-gray-700'>角度</label>
                  <div className='mt-1'>
                    <input type='number' name='degree' id='degree' defaultValue={state.degree} onChange={(e) => setState({ ...state, degree: Number(e.target.value) })} className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md' placeholder='角度を入力...' />
                  </div>
                </div>
                <div className='mt-4'>
                  <label htmlFor='distance' className='block text-sm font-medium text-gray-700'>直線の距離</label>
                  <div className='mt-1'>
                    <input type='number' name='distance' id='distance' defaultValue={state.distance} onChange={(e) => setState({ ...state, distance: Number(e.target.value) })} className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md' placeholder='距離を入力...' />
                  </div>
                </div>
                <div className='mt-6 flex items-start'>
                  <div className='flex items-center h-5'>
                    <input id='center' name='center' type='checkbox' checked={state.centerChecked} onChange={() => setState({ ...state, centerChecked: !state.centerChecked })} className='h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-0' />
                  </div>
                  <div className='ml-3 text-sm'>
                    <label htmlFor='center' className='font-medium text-gray-700'>グリッドの中心を始点にする</label>
                  </div>
                </div>
                <div className='mt-4 flex items-start'>
                  <div className='flex items-center h-5'>
                    <input id='add' name='add' type='checkbox' checked={state.nonOverrideChecked} onChange={() => setState({ ...state, nonOverrideChecked: !state.nonOverrideChecked })} className='h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-0' />
                  </div>
                  <div className='ml-3 text-sm'>
                    <label htmlFor='add' className='font-medium text-gray-700'>上書きしない</label>
                  </div>
                </div>
                <div className='pt-8 flex space-x-4'>
                  <button type='button' onClick={() => submit()} className='transition ease-in-out inline-flex items-center px-4 py-1.5 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-0'>
                    適用
                  </button>
                  <button type='button' onClick={() => download()} className='transition ease-in-out inline-flex items-center px-4 py-1.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0'>
                    画像をダウンロード
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='flex justify-center py-24'>
        <span className='text-center text-sm text-gray-400'>©︎ {new Date().getFullYear()} Degret.</span>
      </footer>
    </>
  )
}
