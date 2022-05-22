import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { sanityClient, urlFor } from '../sanity'
import Link from 'next/link'

const Home = ({collections}) => {
  return (
    <div
      className='max-w-7xl flex mx-auto min-h-screen flex-col
      py-20 px-10 2xl:px-0'
    >
      <Head>
        <title>NFT Market place</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1
        className='mb-10 text-4xl font-extralight'
      >
        The{' '}
        <span
          className='font-extrabold
          underline decoration-pink-600/50'
        >
          SAMS.JS
        </span>
          {' '}NFT Market Place
      </h1>
      <main className='bg-slate-900 p-10 shadow-xl shadow-rose-400/20 rounded-lg'>
        <div
          className='space-x-3 grid md:grid-cols-2
          lg:grid-cols-3 2xl:grid-cols-4'
        >
          {
            collections.map(item => (
              <Link
                href={`/nft/${item.slug.current}`}
              >
                <div
                  className='flex flex-col items-center
                  cursor-pointer transition-all duration-200 hover:scale-105'
                >
                  <img
                    className='h-96 w-60 rounded-2xl object-cover'
                    src={urlFor(item.mainImage).url()}
                    alt='NFT Main cover'
                  />
                  <div
                    className='p-5'
                  >
                    <h1 className='text-3xl'>
                      {item.title}
                    </h1>
                    <p className='text-sm text-gray-400 mt-2'>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `
  *[_type == "collection"]{
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
  const collections = await sanityClient.fetch(query)
  return {
    props: {
      collections
    }
  }
}
