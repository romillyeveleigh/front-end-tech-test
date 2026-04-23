"use client";

import styled from "styled-components";
import type { ReactNode } from "react";

const PanelRoot = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) =>
    `${theme.space.md} ${theme.space.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }
`;

const PanelBody = styled.div`
  padding: ${({ theme }) => theme.space.lg};
`;

interface PanelProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, actions, children }: PanelProps) {
  return (
    <PanelRoot>
      <PanelHeader>
        <h2>{title}</h2>
        {actions ? <div>{actions}</div> : null}
      </PanelHeader>
      <PanelBody>{children}</PanelBody>
    </PanelRoot>
  );
}
