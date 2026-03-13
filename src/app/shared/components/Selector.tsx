import React, { useState } from 'react';
import { loadPublicKey } from "@app/core/beamAPI";
import { useDispatch, useSelector } from "react-redux";
import { BEAM, NETWORKS_BY_ID } from "../constants";
import { styled } from "@linaria/react";
import { css } from '@linaria/core';
import { setActiveNetwork } from '../store/actions';
import { selectActiveNetwork } from '../store/selectors';


interface DropdownProps {
  isVisible: boolean
};

interface BackDropProps {
  onCancel?: React.MouseEventHandler;
}

const StyledDropdown = styled.div`
  margin: 12px auto 20px auto;
`;

const DropdownElem = styled.div`
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 220px;
  height: 44px;
  border-radius: 12px;
  background-color: #031e3b;
  padding: 10px 16px;
`;

const DropdownElemOption = styled.div`
  font-size: 14px;
  padding: 6px 0;
  cursor: pointer;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
`;

const DropdownBody = styled.div<DropdownProps>`
  z-index: 100;
  width: 220px;
  border-radius: 12px;
  position: absolute;
  background-color: #02182f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 8px;
  padding: 10px 16px;
  display: ${({ isVisible }) => `${isVisible ? 'block' : 'none'}`};
`;

const Triangle = styled.div`
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(255, 255, 255, 0.5);
  margin-left: auto;
`;

const CurrencyClass = css`
  line-height: 1;
  margin-left: 12px;
`;

const BackdropStyled = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const BackDrop: React.FC<BackDropProps> = ({
  onCancel,
  children,
}) => {
  const handleOutsideClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onCancel?.(event);
    }
  };

  return (
    <BackdropStyled onClick={handleOutsideClick}>
      { children }
    </BackdropStyled>
  );
};

export const Selector: React.FC = () => {
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!isOpen);
  const activeNetwork = useSelector(selectActiveNetwork());
  
  const handleNetworkClick = async (id: string) => {
    const pk = await loadPublicKey(null, BEAM.cid_by_network[id]);
    dispatch(setActiveNetwork({
      network: id,
      pk,
    }))
    setOpen(false);
  }

  return (<StyledDropdown>
    <DropdownElem onClick={toggleDropdown}>
      <span className={CurrencyClass}>{NETWORKS_BY_ID[activeNetwork.network].name}</span>
      <Triangle></Triangle>
    </DropdownElem>
    {
      isOpen && (
        <>
          <DropdownBody isVisible={isOpen} className={`dropdown-body ${isOpen && 'open'}`}>
            {Object.entries(NETWORKS_BY_ID).map(([id, data]) => (
              <DropdownElemOption key={id} onClick={e => handleNetworkClick(id)}>
                <span className={CurrencyClass}>
                  {data.name}
                </span>
              </DropdownElemOption>
            ))}
          </DropdownBody>
          <BackDrop onCancel={()=>setOpen(false)}/>
        </>
      )
    }
  </StyledDropdown>);
}