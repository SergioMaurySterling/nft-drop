import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"


function MyApp({ Component, pageProps }: AppProps) {
  return (
    //.Mainnet is connected to the ETH red
    //.Rinkbey is connected to the Rinkbey testnet
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}

export default MyApp
