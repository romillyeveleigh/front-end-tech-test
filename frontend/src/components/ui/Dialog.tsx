"use client";

import styled from "styled-components";
import type { ReactNode } from "react";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.lg};
  z-index: 50;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 560px;
`;

const Header = styled.header`
  padding: ${({ theme }) =>
    `${theme.space.md} ${theme.space.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.weights.semibold};
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.space.lg};
`;

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  if (!open) return null;
  return (
    <Overlay onClick={onClose}>
      <Box role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        {title ? <Header>{title}</Header> : null}
        <Body>{children}</Body>
      </Box>
    </Overlay>
  );
}
