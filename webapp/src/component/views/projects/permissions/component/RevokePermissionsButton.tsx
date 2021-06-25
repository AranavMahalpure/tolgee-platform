import { FunctionComponent, ReactElement } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { confirmation } from '../../../../../hooks/confirmation';
import { T } from '@tolgee/react';
import { components } from '../../../../../service/apiSchema.generated';
import { useUser } from '../../../../../hooks/useUser';
import { container } from 'tsyringe';
import { useProject } from '../../../../../hooks/useProject';
import { useApiMutation } from '../../../../../service/http/useQueryApi';
import { MessageService } from '../../../../../service/MessageService';

const messageService = container.resolve(MessageService);

const RevokePermissionsButton = (props: {
  user: components['schemas']['UserAccountInProjectModel'];
}) => {
  const hasOrganizationRole = !!props.user.organizationRole;
  const project = useProject();
  const currentUser = useUser();

  const revokeAccess = useApiMutation({
    url: '/v2/projects/{projectId}/users/{userId}/revoke-access',
    method: 'put',
    invalidatePrefix: '/v2/projects/{projectId}/users',
  });

  const handleRevoke = () => {
    revokeAccess.mutate(
      {
        path: {
          projectId: project.id,
          userId: props.user.id,
        },
      },
      {
        onSuccess() {
          messageService.success(<T>access_revoked_message</T>);
        },
      }
    );
  };

  let disabledTooltipTitle = undefined as ReactElement | undefined;

  if (currentUser!.id === props.user.id) {
    disabledTooltipTitle = <T noWrap>cannot_revoke_your_own_access_tooltip</T>;
  } else if (hasOrganizationRole) {
    disabledTooltipTitle = <T noWrap>user_is_part_of_organization_tooltip</T>;
  }

  const isDisabled = !!disabledTooltipTitle;

  const Wrapper: FunctionComponent = (props) =>
    !isDisabled ? (
      <>{props.children}</>
    ) : (
      <Tooltip title={disabledTooltipTitle!}>
        <span>{props.children}</span>
      </Tooltip>
    );

  return (
    <Wrapper>
      <Button
        data-cy="permissions-revoke-button"
        disabled={isDisabled}
        size="small"
        variant="outlined"
        onClick={() =>
          confirmation({
            title: <T>revoke_access_confirmation_title</T>,
            message: (
              <T
                parameters={{
                  userName: props.user.name || props.user.username!,
                }}
              >
                project_permissions_revoke_user_access_message
              </T>
            ),
            onConfirm: handleRevoke,
          })
        }
      >
        Revoke
      </Button>
    </Wrapper>
  );
};

export default RevokePermissionsButton;