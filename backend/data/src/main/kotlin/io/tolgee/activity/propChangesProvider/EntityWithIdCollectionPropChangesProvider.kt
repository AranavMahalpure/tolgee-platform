package io.tolgee.activity.propChangesProvider

import io.tolgee.activity.data.PropertyModification
import io.tolgee.model.EntityWithId
import org.springframework.stereotype.Service

@Service
class EntityWithIdCollectionPropChangesProvider : PropChangesProvider {
  override fun getChanges(
    old: Any?,
    new: Any?,
  ): PropertyModification? {
    val baseCollectionChangesProvider =
      BaseCollectionChangesProvider(
        old as Collection<Any?>?,
        new as Collection<Any?>?,
      ) { (it as EntityWithId).id }
    return baseCollectionChangesProvider.provide()
  }
}