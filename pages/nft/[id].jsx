import React, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

function NFTDropPage({ collection }) {
  const [claimedSupply, setClaimedSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [loading, setLoading] = useState(true)
  const [priceInETH, setPriceInETH] = useState('')
  const nftDrop = useNFTDrop(collection.address)

  //Auth
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  // --

  const mintNFT = () => {
    setLoading(true)
    const notification = toast.loading('Minting NFT...', {
      style:{
        background: 'white',
        color: 'green',
        fontWeight: 'bold',
        fontSize: '17px',
        padding: '20px'
      }
    })
    if (!nftDrop || !address) return
    const quantity = 1; //How many unique NFTs you wanna mint/claim
    nftDrop.claimTo(address, quantity).then(async(tx)=>{
      const receipt = tx[0].receipt //Get the receipt
      const claimedTokenId = tx[0].id //Get the tokenId
      const claimedNFT = await tx[0].data() // Get the NFT data
      toast(`Hooray... You succesfully minted`, {
        duration: 8000,
        style:{
          background: 'green',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px'
        }
      })
    }).catch((err)=>{
      console.log(err)
      toast(`Whoops... Something went wrong!`, {
        duration: 8000,
        style:{
          background: 'red',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px'
        }
      })
    }).finally(()=>{
      setLoading(false)
      toast.dismiss(notification)
    })
  }

  useEffect(() => {
    if (!nftDrop) return
    const fetchNFTDropData = async () => {
      setLoading(true)
      const claimConditions = await nftDrop.claimConditions.getAll()
      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()
      setClaimedSupply(claimed.length)
      setTotalSupply(total)
      setPriceInETH(claimConditions?.[0].currencyMetadata.displayValue)
      setLoading(false)
    }
    fetchNFTDropData()
  }, [nftDrop])

  return (
    <div
      className="flex h-screen flex-col lg:grid
      lg:grid-cols-10"
    >
      <Toaster
        position='top-center'
      />
      {/* Left side */}
      <div
        className="bg-gradient-to-br from-cyan-800
      to-rose-500 lg:col-span-4"
      >
        <div
          className="flex flex-col items-center
          justify-center py-2 lg:min-h-screen"
        >
          <div
            className="rounded-xl bg-gradient-to-br
            from-yellow-400 to-purple-600 p-2"
          >
            <img
              src={urlFor(collection.previewImage).url()}
              alt="APE"
              className="w-44 rounded-xl object-cover
              lg:h-96 lg:w-72"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* Right side */}
      <div
        className="flex flex-1 flex-col
        p-12 lg:col-span-6"
      >
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <h1
              className="w-52 cursor-pointer
              text-xl font-extralight sm:w-80"
            >
              The{' '}
              <span
                className="font-extrabold
                underline decoration-pink-600/50"
              >
                SAMS.JS
              </span>{' '}
              NFT Market Place
            </h1>
          </Link>
          <button
            className="rounded-full bg-rose-400
            px-4 py-2 text-xs font-bold text-white
            lg:px-5 lg:py-3 lg:text-base"
            onClick={() => (address ? disconnect() : connectWithMetamask())}
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p className="text-center text-sm text-rose-400">
            You're looged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        {/* Content */}
        <div
          className="mt-10 flex flex-1 flex-col
          items-center space-y-6 text-center lg:justify-center
          lg:space-y-0"
        >
          <img
            className="w-80 object-cover pb-10
            lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt="static"
          />
          <h1
            className="text-3xl font-bold lg:text-5xl
            lg:font-extrabold"
          >
            {collection.title}
          </h1>
          {loading ? (
            <p
              className="animate-pulse pt-2 text-xl
                text-green-500"
            >
              Loading Supply Count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFT's claimed
            </p>
          )}
          {loading && (
            <img
              className="h-20 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt="loading pic"
            />
          )}
        </div>
        {/* Mint button */}
        <button
          onClick={mintNFT}
          disabled={
            loading || claimedSupply === totalSupply?.toString() || !address
          }
          className="mt-10 h-16
          w-full rounded-full bg-red-600 font-bold text-white
          disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toString() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign In To Mint</>
          ) : (
            <span className='font-bold'>Mint NFT ({priceInETH} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps = async ({ params }) => {
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
  const collection = await sanityClient.fetch(query, { id: params?.id })

  if (!collection) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      collection,
    },
  }
}
