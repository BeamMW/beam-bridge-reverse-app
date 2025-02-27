import React, { useState, useEffect, useRef } from 'react';
import { loadPublicKey } from "@app/core/beamAPI";
import { useDispatch, useSelector } from "react-redux";
import { BEAM, DEFAULT_NETWORK_ID, NETWORKS_BY_ID } from "../constants";
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
  const rootRef = useRef();

  const handleOutsideClick = (event) => {
    if (event.target === rootRef.current) {
      onCancel(event);
    }
  };

  return (
    <BackdropStyled ref={rootRef} onClick={handleOutsideClick}>
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

  const StyledDropdown = styled.div`
    margin: 20px auto 30px auto;
  `;

  const DropdownElem = styled.div`
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 234px;
    height: 55px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 15px 24px;
  `;

  const DropdownElemOption = styled.div`
    font-size: 16px;
    padding: 8px 0;
    cursor: pointer;
    font-size: 16px;
    letter-spacing: 0.4px;
    display: flex;
    align-items: center;
  `;

  const DropdownBody = styled.div<DropdownProps>`
    z-index: 100;
    width: 234px;
    border-radius: 10px;
    position: absolute;
    background-color: #1c3a59;
    margin-top: 10px;
    padding: 12px 24px;
    display: ${({ isVisible }) => `${isVisible ? 'block' : 'none'}`};
  `;

  const Triangle = styled.div`
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #8da1ad;
    margin-left: auto;
  `;

  const CurrencyClass = css`
    line-height: 1;
    margin-left: 16px;
  `;

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