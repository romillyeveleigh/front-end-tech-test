"use client";

import styled from "styled-components";

const Wrap = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) =>
    `${theme.space.xl} ${theme.space.lg}`};
  text-align: center;
`;

const Title = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Description = styled.p`
  margin: ${({ theme }) => `${theme.space.xs} 0 0`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
`;

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Wrap>
      <Title>{title}</Title>
      {description ? <Description>{description}</Description> : null}
    </Wrap>
  );
}
