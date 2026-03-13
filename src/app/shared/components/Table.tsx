import React, { useState } from 'react';
import { styled } from '@linaria/react';

interface CellConfig {
  name: string;
  title: string;
  fn?: (value: any, source: any, index?: number) => any;
}

interface TableProps {
  data: any[];
  config: CellConfig[];
}

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;

  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const StyledThead = styled.thead`
  background-color: rgba(255, 255, 255, 0.05);
`;

const isPositive = (value: number) => 1 / value > 0;

const Header = styled.th<{ active: boolean }>`
  text-align: left;
  color: ${({ active }) => {
    if (!active) {
      return 'rgba(255, 255, 255, 0.6)';
    }
    return active ? '#ffffff' : 'rgba(255, 255, 255, 0.6)';
  }};
  padding: 12px 18px;
  font-size: 11px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  font-weight: 700;
`;

const Column = styled.td`
  padding: 14px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const Table: React.FC<TableProps> = ({ data, config }) => {
  const [filterBy, setFilterBy] = useState(0);
  const tableData = [...data];

  const sortFn = (objectA, objectB) => {
    const name = config[Math.abs(filterBy)].name;
    const a = objectA[name];
    const b = objectB[name];

    if (a === b) {
      return 0;
    }

    const sign = isPositive(filterBy) ? 1 : -1;
    return a > b ? sign : -sign;
  };

  const handleSortClick: React.MouseEventHandler<HTMLElement> = event => {
    const index = parseInt(event.currentTarget.dataset.index);
    setFilterBy(index === filterBy ? -filterBy : index);
  };

  const hasData = tableData && tableData.length > 0;

  return  (
    <StyledTable>
      {hasData && (
        <StyledThead>
          <tr>
            {config.map(({ title }, index) => (
              <Header
                key={index}
                data-index={index}
                active={
                  index !== Math.abs(filterBy) ? null : isPositive(filterBy)
                }
                onClick={handleSortClick}>
                  {title}
              </Header>
            ))}
          </tr>
        </StyledThead>
      )}
      <tbody>
        {hasData ? tableData.sort(sortFn).map((item, index) => (
          <tr key={index}>
            {config.map(({ name, fn }, itemIndex) => {
              const value = item[name];
              return (<Column key={itemIndex}>{!fn ? value : fn(value, item, index)}</Column>);
            })}
          </tr>
        )): (<></>)
      }
      </tbody>
    </StyledTable>
  ) ;
};

export default Table;
