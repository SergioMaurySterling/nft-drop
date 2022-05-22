import React from 'react'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react"
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import Link from 'next/link'

function NFTDropPage({collection}) {
  //Auth
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  console.log(address)
  // --

  return (
    <div
      className='flex h-screen flex-col lg:grid
      lg:grid-cols-10'
    >
      {/* Left side */}
      <div className='bg-gradient-to-br from-cyan-800
      to-rose-500 lg:col-span-4'>
        <div
          className='flex flex-col items-center
          justify-center py-2 lg:min-h-screen'
        >
          <div
            className='bg-gradient-to-br from-yellow-400
            to-purple-600 p-2 rounded-xl'
          >
            <img
              src={urlFor(collection.previewImage).url()}
              alt='APE'
              className='w-44 rounded-xl object-cover
              lg:h-96 lg:w-72'
            />
          </div>
          <div
            className='text-center p-5 space-y-2'
          >
            <h1
              className='text-white text-4xl font-bold'
            >
              {collection.nftCollectionName}
            </h1>
            <h2
              className='text-gray-300 text-xl'
            >{collection.description}
            </h2>
          </div>
        </div>
      </div>
      {/* Right side */}
      <div
        className='flex flex-1 flex-col
        p-12 lg:col-span-6'
      >
        {/* Header */}
        <header
          className='flex items-center justify-between'
        >
          <Link href={'/'}>
            <h1
              className='w-52 cursor-pointer
              text-xl font-extralight sm:w-80'
            >
              The{' '}
              <span
                className='font-extrabold
                underline decoration-pink-600/50'
              >
                PAPAFAM
              </span>
                {' '}NFT Market Place
            </h1>
          </Link>
          <button
            className='rounded-full bg-rose-400
            text-white px-4 py-2 text-xs font-bold
            lg:px-5 lg:py-3 lg:text-base'
            onClick={
              () => address ? disconnect() : connectWithMetamask()
            }
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>
        <hr className='my-2 border'/>
        {address && (
          <p
            className='text-center text-sm text-rose-400'
          >
            You're looged in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}
          </p>
        )}
        {/* Content */}
        <div
          className='mt-10 flex flex-1 flex-col
          items-center space-y-6 text-center lg:justify-center
          lg:space-y-0'
        >
          <img
            className='w-80 object-cover pb-10
            lg:h-40'
            src={urlFor(collection.mainImage).url()}
            alt='static'
          />
          <h1
            className='text-3xl font-bold lg:text-5xl
            lg:font-extrabold'
          >
            {collection.title}
          </h1>
          <p
            className='pt-2 text-xl text-green-500
            '
          >
            13 / 21 NFT's claimed
          </p>
        </div>
        {/* Mint button */}
        <button
          className='rounded-full bg-red-600
          h-16 w-full text-white mt-10 font-bold'
        >
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps = async ({params}) => {
  const query = `
  *[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }
  `
  const collection = await sanityClient.fetch(query ,{id: params?.id})

  if (!collection) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      collection
    }
  }
}