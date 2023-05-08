import { Pagination as _Pagination } from "@mantine/core"
import { IconArrowRight, IconArrowLeft, IconArrowBarToLeft, IconArrowBarToRight, IconGripHorizontal } from "@tabler/icons-react"

const Pagination = ({
  totalPages,
  active,
  onPaginationChange,
  className
}:
  {
    totalPages: number,
    active: number,
    onPaginationChange: (value: number) => void,
    className?: string
  }) => {
  return (
    <_Pagination
      disabled={totalPages === 1}
      className={className}
      total={totalPages}
      value={active}
      onChange={onPaginationChange}
      position="center"
      withEdges
      nextIcon={IconArrowRight}
      previousIcon={IconArrowLeft}
      firstIcon={IconArrowBarToLeft}
      lastIcon={IconArrowBarToRight}
      dotsIcon={IconGripHorizontal}
    />
  )
}

export default Pagination