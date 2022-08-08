import {Button, ButtonGroup} from '@chakra-ui/react';

export const Pagination = ({first, last, current, totalPages, handlePrevious, handleNext, handleNumbers}) => {
  return (
    <ButtonGroup size='sm' isAttached variant='outline'>
      <Button isDisabled={first}
              onClick={first ? () => {
              } : handlePrevious}>
        previous
      </Button>
      <PageButton currentPage={current} lastPage={totalPages} handlePageClick={handleNumbers}/>
      <Button isDisabled={last} onClick={last ? () => {
      } : handleNext}>
        next
      </Button>
    </ButtonGroup>
  )
}

const PageButton = ({currentPage, lastPage, handlePageClick}) => {
  const render = [];

  let startIdx;
  let endIdx;
  if (currentPage - 1 >= 0) {
    startIdx = currentPage - 1;
    endIdx = startIdx + 5;
  } else {
    startIdx = 0;
    endIdx = 5;
  }
  if (currentPage + 3 >= lastPage) {
    startIdx = lastPage - 5;
    endIdx = lastPage;
  }

  if (lastPage < 5) {
    startIdx = 0;
    endIdx = lastPage;
  }

  for (let idx = startIdx; idx < endIdx; idx++) {
    const offset = idx + 1;
    render.push(
      <Button key={`page-${offset}`} onClick={() => handlePageClick(idx)} value={idx}
              isDisabled={idx === currentPage}>
        {offset}
      </Button>
    );
  }

  return render;
};