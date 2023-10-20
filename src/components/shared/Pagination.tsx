import { css } from '@emotion/react';
import { theme } from '@theme';
import { useEffect, useState } from 'react';

interface IProps {
  totalPages: number;
  currentPage: number;
  pageChanged: (page: number) => void;
}

interface IPage {
  name: number;
  isDisabled: boolean;
}

const paginationList = css({
  listStyle: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  gap: theme.spacing.md,
  padding: 0,
  margin: `${theme.spacing.lg} 0`,
});

const paginationButton = css({
  backgroundColor: 'transparent',
  border: 'none',
  color: theme.palette.grey[400],
  fontSize: theme.text.md,
});

const activePaginationButton = css(paginationButton, {
  color: theme.palette.primary.main,
  borderBottom: `2px solid ${theme.palette.primary.main}`,
});

const Pagination = ({ totalPages, currentPage, pageChanged }: IProps) => {
  const maxVisibleButtons = 3;
  const maxNumberUntilShowDots = maxVisibleButtons + 2;
  const isInFirstPage = currentPage === 1;
  const isInLastPage = currentPage === totalPages;
  const isInRangeFirstPage =
    currentPage - maxVisibleButtons < (maxVisibleButtons % 2 === 0 ? 2 : 1);
  const isInRangeLastPage = currentPage + maxVisibleButtons > totalPages;
  const isDotsMustShow = totalPages > maxNumberUntilShowDots;

  const [startPage, setStartPage] = useState(1);
  const [pageRange, setPageRange] = useState<IPage[]>([]);
  const endPage = startPage + maxVisibleButtons;

  const onClickPreviousPage = () => {
    pageChanged(currentPage - 1);
  };

  const onClickNextPage = () => {
    pageChanged(currentPage + 1);
  };

  const onClickFirstPage = () => {
    pageChanged(1);
  };

  const onClickLastPage = () => {
    pageChanged(totalPages);
  };

  const onClickPage = (page: number) => {
    pageChanged(page);
  };

  const onClickRangePreviousPage = () => {
    const pageTarget = currentPage - maxVisibleButtons;
    if (pageTarget < 0) {
      return pageChanged(1);
    }
    pageChanged(pageTarget);
  };

  const onClickRangeNextPage = () => {
    const pageTarget = currentPage + maxVisibleButtons;
    if (pageTarget > totalPages) {
      return pageChanged(totalPages);
    }
    pageChanged(pageTarget);
  };

  const isPageActive = (page: number) => {
    return currentPage === page;
  };

  useEffect(() => {
    if (currentPage === 1 || currentPage === 2) {
      setStartPage(2);
    } else if (currentPage === totalPages || currentPage === totalPages - 1) {
      setStartPage(totalPages - maxVisibleButtons);
    } else setStartPage(currentPage - 1);
  }, [currentPage, totalPages]);

  useEffect(() => {
    const range: Array<IPage> = [];

    if (totalPages < 3) {
      setPageRange(range);
    } else if (totalPages < maxNumberUntilShowDots + 1) {
      for (let i = 2; i < totalPages; i++) {
        range.push({
          name: i,
          isDisabled: i === currentPage,
        });
      }
      setPageRange(range);
    } else {
      for (let i = startPage; i < endPage; i += 1) {
        range.push({
          name: i,
          isDisabled: i === currentPage,
        });
      }
      setPageRange(range);
    }
  }, [currentPage, endPage, maxNumberUntilShowDots, startPage, totalPages]);

  return (
    <div>
      <ul css={paginationList}>
        {/* <!-- arrow previous page --> */}
        <li className="pagination-item">
          <button
            type="button"
            css={paginationButton}
            disabled={isInFirstPage}
            aria-label="Go to previous page"
            onClick={onClickPreviousPage}
          >
            <span className="kao-chevron-left"></span>
          </button>
        </li>

        {/* <!-- first page --> */}
        <li className="pagination-item">
          <button
            type="button"
            css={css`
              ${currentPage === 1 ? activePaginationButton : paginationButton}
            `}
            disabled={isInFirstPage}
            aria-label="Go to first page"
            onClick={onClickFirstPage}
          >
            1
          </button>
        </li>

        {/* <!-- dots previous page --> */}
        {!isInRangeFirstPage && isDotsMustShow && (
          <li className="pagination-item">
            <button
              type="button"
              css={paginationButton}
              aria-label="Go to previous page"
              onClick={onClickRangePreviousPage}
            >
              ...
            </button>
          </li>
        )}

        {/* <!-- list of visible button (exclude first and last page) --> */}
        {pageRange.map((page, pi) => (
          <li key={`visible-btn-${pi}`} className="pagination-item">
            {page.name !== 0 && (
              <button
                type="button"
                disabled={page.isDisabled}
                css={css`
                  ${currentPage === page.name
                    ? activePaginationButton
                    : paginationButton}
                `}
                aria-label={`Go to page number ${page.name}`}
                onClick={() => onClickPage(page.name)}
              >
                {page.name}
              </button>
            )}
          </li>
        ))}

        {/* <!-- dots next page --> */}
        {!isInRangeLastPage && isDotsMustShow && (
          <li className="pagination-item">
            <button
              type="button"
              css={paginationButton}
              aria-label="Go to next page"
              onClick={onClickRangeNextPage}
            >
              ...
            </button>
          </li>
        )}

        {/* <!-- last page --> */}
        {totalPages > 1 && (
          <li className="pagination-item">
            <button
              type="button"
              css={css`
                ${currentPage === totalPages
                  ? activePaginationButton
                  : paginationButton}
              `}
              disabled={isInLastPage}
              aria-label="Go to last page"
              onClick={onClickLastPage}
            >
              {totalPages}
            </button>
          </li>
        )}

        {/* <!-- arrow next page --> */}
        <li className="pagination-item">
          <button
            type="button"
            css={paginationButton}
            disabled={isInLastPage}
            aria-label="Go to next page"
            onClick={onClickNextPage}
          >
            <span className="kao-chevron-right"></span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
