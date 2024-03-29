import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { Pool } from '@pancakeswap/widgets-internal'
import { useQueryClient } from '@tanstack/react-query'
import poolRelatedQueries from 'components/Pools/utils/poolRelatedQueries'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import splitTypeTag from 'utils/splitTypeTag'

import useStakePool from '../../hooks/useStakePool'
import useUnstakePool from '../../hooks/useUnstakePool'
import StakeModalContainer from './StakeModalContainer'

const StakeModal = ({ pool, ...rest }: Pool.StakeModalPropsType<Coin>) => {
  const { stakingToken, contractAddress } = pool
  const queryClient = useQueryClient()
  const { account } = useActiveWeb3React()
  const [stakingTokenAddress, earningTokenAddress, uid] = splitTypeTag(contractAddress)

  const onUnstake = useUnstakePool({
    uid,
    earningTokenAddress,
    stakingTokenAddress,
    stakingTokenDecimals: stakingToken?.decimals,
  })
  const onStake = useStakePool({
    uid,
    earningTokenAddress,
    stakingTokenAddress,
    stakingTokenDecimals: stakingToken?.decimals,
  })

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: poolRelatedQueries(account),
    })
  }, [account, queryClient])

  return <StakeModalContainer onDone={onDone} onUnstake={onUnstake} onStake={onStake} pool={pool} {...rest} />
}

export default StakeModal
